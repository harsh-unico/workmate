'use strict';

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

function createTask(req, res) {
  return handle(async () => {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
      assignerId,
      completedAt
    } = req.body || {};

    if (!title || typeof title !== 'string') {
      const error = new Error('Task title is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = {
      title,
      description: description || null,
      status: status || null,
      priority: priority || null,
      due_date: dueDate || null,
      project_id: projectId || null,
      assignee_id: assigneeId || null,
      // Default assigner to authenticated user if not provided
      assigner_id: (assignerId || (req.user && req.user.id)) ? String(assignerId || req.user.id) : null,
      completed_at: completedAt || null
    };

    const created = await taskRepository.insertOne(payload);
    return { data: created };
  }, req, res);
}

function listTasks(req, res) {
  return handle(async () => {
    const { projectId, assigneeId, assignerId, status, priority } = req.query || {};

    const filters = {};
    if (projectId) filters.project_id = String(projectId);
    if (assigneeId) filters.assignee_id = String(assigneeId);
    if (assignerId) filters.assigner_id = String(assignerId);
    if (status) filters.status = String(status);
    if (priority) filters.priority = String(priority);

    const tasks = await taskRepository.findMany(filters);
    return { data: tasks };
  }, req, res);
}

function listTasksByAssignee(req, res) {
  return handle(async () => {
    const userId = req.params && req.params.userId ? String(req.params.userId) : null;
    if (!userId) {
      const error = new Error('userId is required');
      error.statusCode = 400;
      throw error;
    }

    const tasks = await taskRepository.findMany({ assignee_id: userId });
    return { data: tasks };
  }, req, res);
}

function listTasksByAssigner(req, res) {
  return handle(async () => {
    const userId = req.params && req.params.userId ? String(req.params.userId) : null;
    if (!userId) {
      const error = new Error('userId is required');
      error.statusCode = 400;
      throw error;
    }

    const tasks = await taskRepository.findMany({ assigner_id: userId });
    return { data: tasks };
  }, req, res);
}

function getTaskById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Task id is required');
      error.statusCode = 400;
      throw error;
    }

    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: task };
  }, req, res);
}

function updateTaskById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Task id is required');
      error.statusCode = 400;
      throw error;
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
      assignerId,
      completedAt
    } = req.body || {};

    const payload = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(dueDate !== undefined ? { due_date: dueDate } : {}),
      ...(projectId !== undefined ? { project_id: projectId } : {}),
      ...(assigneeId !== undefined ? { assignee_id: assigneeId } : {}),
      ...(assignerId !== undefined ? { assigner_id: assignerId } : {}),
      ...(completedAt !== undefined ? { completed_at: completedAt } : {})
    };

    const updated = await taskRepository.updateById(id, payload);
    if (!updated) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: updated };
  }, req, res);
}

function deleteTaskById(req, res) {
  return handle(async () => {
    const id = req.params && req.params.id ? String(req.params.id) : null;
    if (!id) {
      const error = new Error('Task id is required');
      error.statusCode = 400;
      throw error;
    }

    const deleted = await taskRepository.deleteById(id);
    if (!deleted) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return { data: deleted };
  }, req, res);
}

module.exports = {
  createTask,
  listTasks,
  listTasksByAssignee,
  listTasksByAssigner,
  getTaskById,
  updateTaskById,
  deleteTaskById
};


