'use strict';

const repo = require('../repositories/projectRepository');
const { InsertSchema, UpdateSchema } = require('../models/project');
const { parsePagination, sendOk, sendError } = require('./utils');

async function createProject(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getProject(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listProjects(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.org_id !== undefined) filter.org_id = Number(req.query.org_id);
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.team_lead_id !== undefined) filter.team_lead_id = Number(req.query.team_lead_id);
    if (req.query.project_manager_id !== undefined) filter.project_manager_id = Number(req.query.project_manager_id);
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateProject(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteProject(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = {
  createProject,
  getProject,
  listProjects,
  updateProject,
  deleteProject
};


