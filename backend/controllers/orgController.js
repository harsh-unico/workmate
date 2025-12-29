'use strict';

const orgRepository = require('../repositories/orgRepository');
const orgMemberRepository = require('../repositories/orgMemberRepository');
const projectRepository = require('../repositories/projectRepository');
const taskRepository = require('../repositories/taskRepository');

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

  const orgMember = await orgMemberRepository.findOne({
    org_id: String(orgId),
    user_id: String(userId)
  });
  if (!orgMember) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
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

    const richAbout =
      typeof description === 'string'
        ? description
        : (typeof about === 'string' ? about : null);

    // eslint-disable-next-line no-console
    console.log('[orgController.createOrganisation] incoming about length:', richAbout ? richAbout.length : 0);

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
      // Store Quill HTML (rich text) as-is
      about: richAbout
    };

    const created = await orgRepository.insertOne(payload);
    // eslint-disable-next-line no-console
    console.log('[orgController.createOrganisation] saved about length:', created && created.about ? created.about.length : 0);

    // Create org member entry for the user who created this organisation
    const orgMember = await orgMemberRepository.insertOne({
      org_id: created.id,
      user_id: userId,
      is_admin: true
    });

    return { data: created, org_member: orgMember };
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

module.exports = {
  listOrganisations,
  listAdminOrganisations,
  listAdminOrganisationsForUser,
  createOrganisation,
  getOrgProjectCount,
  getOrgMemberCount,
  getOrgTaskCount,
  getOrganisationById,
  listOrgProjects
};



