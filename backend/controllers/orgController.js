'use strict';

const orgRepository = require('../repositories/orgRepository');
const orgMemberRepository = require('../repositories/orgMemberRepository');
const projectRepository = require('../repositories/projectRepository');
const taskRepository = require('../repositories/taskRepository');
const userRepository = require('../repositories/userRepository');

async function handle(controllerFn, req, res) {
  try {
    const result = await controllerFn(req, res);
    if (!res.headersSent) {
      res.json(result);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    const status = err.statusCode || 400;
    res.status(status).json({
      error: err.message || 'Unexpected error'
    });
  }
}

async function requireOrgMember(req, orgId) {
  const userId = req.user && req.user.id ? String(req.user.id) : null;
  if (!userId) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const membership = await orgMemberRepository.findOne({
    org_id: String(orgId),
    user_id: String(userId)
  });

  if (!membership) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  return membership;
}

async function requireOrgAdmin(req, orgId) {
  const membership = await requireOrgMember(req, orgId);
  if (!membership.is_admin) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
  return membership;
}

function normalizeRichTextHtml(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const v = String(value);
  const trimmed = v.trim();
  if (!trimmed || trimmed === '<p><br></p>') return null;
  return v;
}

function listOrganisations(req, res) {
  return handle(async () => {
    const organisations = await orgRepository.findMany();
    return { data: organisations };
  }, req, res);
}

function listAdminOrganisations(req, res) {
  return handle(async () => {
    const userId = req.user && req.user.id ? String(req.user.id) : null;
    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const orgIds = await orgMemberRepository.findAdminOrgIdsForUser(userId);
    const organisations = await orgRepository.findManyByIds(orgIds);
    return { data: organisations };
  }, req, res);
}

function listAdminOrganisationsForUser(req, res) {
  return handle(async () => {
    const userId = req.params && req.params.userId ? String(req.params.userId) : null;
    if (!userId) {
      const error = new Error('userId is required');
      error.statusCode = 400;
      throw error;
    }

    // userId in URL must match authenticated user
    if (req.user && req.user.id && String(req.user.id) !== userId) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    const orgIds = await orgMemberRepository.findAdminOrgIdsForUser(userId);
    const organisations = await orgRepository.findManyByIds(orgIds);
    return { data: organisations };
  }, req, res);
}

function createOrganisation(req, res) {
  return handle(async () => {
    const userId = req.params && req.params.userId ? String(req.params.userId) : (req.user && req.user.id ? String(req.user.id) : null);

    if (!userId) {
      const error = new Error('userId is required');
      error.statusCode = 400;
      throw error;
    }

    // If the client passes userId in URL, it must match the authenticated user
    if (req.params && req.params.userId && req.user && req.user.id && String(req.params.userId) !== String(req.user.id)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    const {
      organisationName,
      email,
      contactNumber,
      description,
      about,
      address,
      country,
      state,
      city,
      pincode
    } = req.body || {};

    if (!organisationName || typeof organisationName !== 'string') {
      const error = new Error('Organisation name is required');
      error.statusCode = 400;
      throw error;
    }

    const richAbout = normalizeRichTextHtml(
      typeof description === 'string' ? description : (typeof about === 'string' ? about : undefined)
    );

    const payload = {
      org_name: organisationName,
      email: email || null,
      phone: contactNumber || null,
      address_line_1: address || null,
      address_line_2: null,
      country: country || null,
      state: state || null,
      city: city || null,
      postal_code: pincode || null,
      about: richAbout === undefined ? null : richAbout
    };

    const created = await orgRepository.insertOne(payload);

    // Create org member entry for the user who created this organisation
    const orgMember = await orgMemberRepository.insertOne({
      org_id: created.id,
      user_id: userId,
      is_admin: true
    });

    return { data: created, org_member: orgMember };
  }, req, res);
}

function getOrganisationById(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);

    const org = await orgRepository.findById(orgId);
    if (!org) {
      const error = new Error('Organisation not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: org };
  }, req, res);
}

function updateOrganisation(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgAdmin(req, orgId);

    const {
      organisationName,
      email,
      contactNumber,
      description,
      about,
      address,
      country,
      state,
      city,
      pincode
    } = req.body || {};

    const payload = {
      ...(organisationName !== undefined ? { org_name: organisationName } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(contactNumber !== undefined ? { phone: contactNumber || null } : {}),
      ...(address !== undefined ? { address_line_1: address || null } : {}),
      ...(country !== undefined ? { country: country || null } : {}),
      ...(state !== undefined ? { state: state || null } : {}),
      ...(city !== undefined ? { city: city || null } : {}),
      ...(pincode !== undefined ? { postal_code: pincode || null } : {}),
    };

    const nextAbout = normalizeRichTextHtml(
      description !== undefined
        ? description
        : (about !== undefined ? about : undefined)
    );
    if (nextAbout !== undefined) {
      payload.about = nextAbout;
    }

    const updated = await orgRepository.updateById(orgId, payload);
    if (!updated) {
      const error = new Error('Organisation not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: updated };
  }, req, res);
}

function getOrgProjectCount(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);
    const count = await projectRepository.countByOrgId(orgId);
    return { data: { orgId, count } };
  }, req, res);
}

function getOrgMemberCount(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);
    const count = await orgMemberRepository.countByOrgId(orgId);
    return { data: { orgId, count } };
  }, req, res);
}

function getOrgTaskCount(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);
    const projectIds = await projectRepository.findIdsByOrgId(orgId);
    const count = await taskRepository.countByProjectIds(projectIds);
    return { data: { orgId, count } };
  }, req, res);
}

function listOrgProjects(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);
    const projects = await projectRepository.findManyByOrgId(orgId);
    return { data: projects };
  }, req, res);
}

function listOrgMembersDetailed(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgMember(req, orgId);

    const memberships = await orgMemberRepository.findMany({ org_id: String(orgId) });
    const userIds = memberships.map((m) => m.user_id).filter(Boolean);
    const users = await userRepository.findManyByIds(userIds);
    const usersById = new Map(users.map((u) => [String(u.id), u]));

    return {
      data: memberships.map((m) => ({
        id: m.id,
        org_id: m.org_id,
        user_id: m.user_id,
        department: m.department || null,
        is_admin: !!m.is_admin,
        joined_at: m.joined_at || null,
        user: usersById.get(String(m.user_id)) || null
      }))
    };
  }, req, res);
}

function inviteOrgMembers(req, res) {
  return handle(async () => {
    const orgId = req.params && req.params.orgId ? String(req.params.orgId) : null;
    if (!orgId) {
      const error = new Error('orgId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireOrgAdmin(req, orgId);

    const { emails, isAdmin, department } = req.body || {};
    const list = Array.isArray(emails) ? emails : [];
    const normalized = Array.from(
      new Set(
        list
          .map((e) => String(e || '').trim().toLowerCase())
          .filter(Boolean)
      )
    );

    if (normalized.length === 0) {
      const error = new Error('emails is required');
      error.statusCode = 400;
      throw error;
    }

    const added = [];
    const skipped = [];
    const notFound = [];

    for (const email of normalized) {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        notFound.push(email);
        continue;
      }

      const existing = await orgMemberRepository.findOne({
        org_id: String(orgId),
        user_id: String(user.id)
      });

      if (existing) {
        skipped.push(email);
        continue;
      }

      const created = await orgMemberRepository.insertOne({
        org_id: String(orgId),
        user_id: String(user.id),
        department: department !== undefined ? department : null,
        is_admin: isAdmin !== undefined ? Boolean(isAdmin) : false
      });

      added.push({ email, org_member: created });
    }

    return { data: { orgId, added, skipped, notFound } };
  }, req, res);
}

module.exports = {
  listOrganisations,
  listAdminOrganisations,
  listAdminOrganisationsForUser,
  createOrganisation,
  getOrganisationById,
  updateOrganisation,
  getOrgProjectCount,
  getOrgMemberCount,
  getOrgTaskCount,
  listOrgProjects,
  listOrgMembersDetailed,
  inviteOrgMembers
};



