'use strict';

const taskRepository = require('../repositories/taskRepository');
const { TASK_STATUS, TASK_PRIORITY } = require('../enums');

function nowIso() {
  return new Date().toISOString();
}

async function getAllTasks(filters = {}) {
  const queryFilters = {};
  if (filters.projectId) {
    queryFilters.project_id = filters.projectId;
  }
  if (filters.status) {
    queryFilters.status = filters.status;
  }
  return taskRepository.findMany(queryFilters);
}

async function createTask(payload) {
  const data = {
    title: payload.title,
    description: payload.description || null,
    status: payload.status || TASK_STATUS.TODO,
    priority: payload.priority || TASK_PRIORITY.MEDIUM,
    due_date: payload.dueDate || null,
    project_id: payload.projectId || null,
    assignee_id: payload.assigneeId || null,
    assigner_id: payload.assignerId || null,
    completed_at: payload.completedAt || null,
    updated_at: nowIso()
  };

  return taskRepository.insertOne(data);
}

async function updateTask(id, payload) {
  const data = {
    title: payload.title,
    description: payload.description,
    status: payload.status,
    priority: payload.priority,
    due_date: payload.dueDate,
    project_id: payload.projectId,
    assignee_id: payload.assigneeId,
    assigner_id: payload.assignerId,
    completed_at: payload.completedAt,
    updated_at: nowIso()
  };

  return taskRepository.updateById(id, data);
}

async function getTaskById(id) {
  return taskRepository.findById(id);
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  getTaskById
};


