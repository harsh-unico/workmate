'use strict';

const { PROJECT_MEMBER_ROLE } = require('../enums');
const projectMemberRepository = require('../repositories/projectMemberRepository');

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

async function requireProjectAdmin(req, projectId) {
  const userId = req.user && req.user.id ? String(req.user.id) : null;
  if (!userId) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const roles = [PROJECT_MEMBER_ROLE.OWNER, PROJECT_MEMBER_ROLE.MANAGER];
  const adminProjectIds = await projectMemberRepository.findAdminProjectIdsForUser(userId, { roles });
  if (!adminProjectIds.includes(String(projectId))) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
}

function createProjectMember(req, res) {
  return handle(async () => {
    const { projectId, userId, role } = req.body || {};
    if (!projectId) {
      const error = new Error('projectId is required');
      error.statusCode = 400;
      throw error;
    }
    if (!userId) {
      const error = new Error('userId is required');
      error.statusCode = 400;
      throw error;
    }

    await requireProjectAdmin(req, projectId);

    const created = await projectMemberRepository.insertOne({
      project_id: String(projectId),
      user_id: String(userId),
      role: role !== undefined ? role : null
    });

    return { data: created };
  }, req, res);
}

function listProjectMembers(req, res) {
  return handle(async () => {
    const { projectId, userId, role } = req.query || {};
    const filters = {};
    if (projectId) filters.project_id = String(projectId);
    if (userId) filters.user_id = String(userId);
    if (role) filters.role = String(role);

    const rows = await projectMemberRepository.findMany(filters);
    return { data: rows };
  }, req, res);
}

function getProjectMemberById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Project member id is required');
      error.statusCode = 400;
      throw error;
    }

    const row = await projectMemberRepository.findById(id);
    if (!row) {
      const error = new Error('Project member not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: row };
  }, req, res);
}

function updateProjectMemberById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Project member id is required');
      error.statusCode = 400;
      throw error;
    }

    const existing = await projectMemberRepository.findById(id);
    if (!existing) {
      const error = new Error('Project member not found');
      error.statusCode = 404;
      throw error;
    }

    await requireProjectAdmin(req, existing.project_id);

    const { projectId, userId, role } = req.body || {};
    const payload = {
      ...(projectId !== undefined ? { project_id: projectId } : {}),
      ...(userId !== undefined ? { user_id: userId } : {}),
      ...(role !== undefined ? { role } : {})
    };

    const updated = await projectMemberRepository.updateById(id, payload);
    return { data: updated };
  }, req, res);
}

function deleteProjectMemberById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Project member id is required');
      error.statusCode = 400;
      throw error;
    }

    const existing = await projectMemberRepository.findById(id);
    if (!existing) {
      const error = new Error('Project member not found');
      error.statusCode = 404;
      throw error;
    }

    await requireProjectAdmin(req, existing.project_id);

    const deleted = await projectMemberRepository.deleteById(id);
    return { data: deleted };
  }, req, res);
}

module.exports = {
  createProjectMember,
  listProjectMembers,
  getProjectMemberById,
  updateProjectMemberById,
  deleteProjectMemberById
};


