'use strict';

const projectRepository = require('../repositories/projectRepository');
const projectMemberRepository = require('../repositories/projectMemberRepository');
const { PROJECT_MEMBER_ROLE } = require('../enums');

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

function createProject(req, res) {
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
      orgId,
      name,
      description,
      about,
      status,
      startDate,
      endDate
    } = req.body || {};

    if (!name || typeof name !== 'string') {
      const error = new Error('Project name is required');
      error.statusCode = 400;
      throw error;
    }

    const richDescription =
      typeof description === 'string'
        ? description
        : (typeof about === 'string' ? about : null);

    // eslint-disable-next-line no-console
    console.log('[projectController.createProject] incoming description length:', richDescription ? richDescription.length : 0);

    const payload = {
      org_id: orgId || null,
      name,
      // Store Quill HTML (rich text) as-is
      description: richDescription,
      status: status || null,
      start_date: startDate || null,
      end_date: endDate || null,
      created_by: userId
    };

    const created = await projectRepository.insertOne(payload);
    // eslint-disable-next-line no-console
    console.log('[projectController.createProject] saved description length:', created && created.description ? created.description.length : 0);

    const projectMember = await projectMemberRepository.insertOne({
      project_id: created.id,
      user_id: userId,
      role: 'owner'
    });

    return { data: created, project_member: projectMember };
  }, req, res);
}

function listAdminProjects(req, res) {
  return handle(async () => {
    const userId = req.user && req.user.id ? String(req.user.id) : null;
    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    // Treat "admin" as users who can manage the project (owner/manager).
    // If you want owner-only, change roles to [PROJECT_MEMBER_ROLE.OWNER].
    const roles = [PROJECT_MEMBER_ROLE.OWNER, PROJECT_MEMBER_ROLE.MANAGER];
    const projectIds = await projectMemberRepository.findAdminProjectIdsForUser(userId, { roles });
    const projects = await projectRepository.findManyByIds(projectIds);
    return { data: projects };
  }, req, res);
}

function listProjectsCreatedByUser(req, res) {
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

    const projects = await projectRepository.findManyCreatedByUser(userId);
    return { data: projects };
  }, req, res);
}

module.exports = {
  createProject,
  listAdminProjects,
  listProjectsCreatedByUser
};



