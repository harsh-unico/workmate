'use strict';

const repo = require('../repositories/taskRepository');
const { InsertSchema, UpdateSchema } = require('../models/task');
const { parsePagination, sendOk, sendError } = require('./utils');

async function createTask(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getTask(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listTasks(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.project_id !== undefined) filter.project_id = Number(req.query.project_id);
    if (req.query.assignee !== undefined) filter.assignee = Number(req.query.assignee);
    if (req.query.assigner !== undefined) filter.assigner = Number(req.query.assigner);
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.status) filter.status = req.query.status;
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateTask(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteTask(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

// Domain-specific helpers
async function assignTask(req, res) {
  try {
    const id = Number(req.params.id);
    const assignee = req.body?.assignee !== undefined ? Number(req.body.assignee) : null;
    const data = await repo.update(id, { assignee });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateTaskStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const status = req.body?.status;
    const data = await repo.update(id, { status });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateTaskDueDate(req, res) {
  try {
    const id = Number(req.params.id);
    const due_date = req.body?.due_date || null;
    const data = await repo.update(id, { due_date });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  updateTaskDueDate
};


