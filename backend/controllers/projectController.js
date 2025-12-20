'use strict';

const projectService = require('../services/projectService');

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

function getAllProjects(req, res) {
  const { orgId } = req.query;
  return handle(() => projectService.getAllProjects({ orgId }), req, res);
}

function createProject(req, res) {
  return handle(() => projectService.createProject(req.body), req, res);
}

function updateProject(req, res) {
  const { id } = req.params;
  return handle(() => projectService.updateProject(id, req.body), req, res);
}

function getProjectDetails(req, res) {
  const { id } = req.params;
  return handle(() => projectService.getProjectById(id), req, res);
}

function getProjectTasks(req, res) {
  const { projectId } = req.params;
  return handle(() => projectService.getProjectTasks(projectId), req, res);
}

function getProjectMembers(req, res) {
  const { projectId } = req.params;
  return handle(() => projectService.getProjectMembers(projectId), req, res);
}

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getProjectTasks,
  getProjectMembers
};


