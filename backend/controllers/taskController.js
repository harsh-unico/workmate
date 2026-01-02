'use strict';

const taskRepository = require('../repositories/taskRepository');
const userRepository = require('../repositories/userRepository');
const projectMemberRepository = require('../repositories/projectMemberRepository');
const { TASK_PRIORITY, TASK_STATUS } = require('../enums');

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

function normalizeTaskPriority(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const v = String(value).trim();
  if (!v) return null;

  const lower = v.toLowerCase();
  const allowed = new Set(Object.values(TASK_PRIORITY || {}));
  if (allowed.has(lower)) return lower;

  // Common UI values like "Medium" / "High"
  if (allowed.has(lower.replace(/\s+/g, '_'))) return lower.replace(/\s+/g, '_');
  return lower; // let DB validate if still invalid
}

function normalizeTaskStatus(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const v = String(value).trim();
  if (!v) return null;

  const norm = v.toLowerCase().replace(/\s+/g, '_');
  const allowed = new Set(Object.values(TASK_STATUS || {}));
  if (allowed.has(norm)) return norm;

  // Map common UI statuses
  if (norm === 'to_do') return TASK_STATUS.TODO;
  if (norm === 'in_review') return TASK_STATUS.IN_PROGRESS;

  return norm; // let DB validate if still invalid
}

function createTask(req, res) {
  return handle(async () => {
    const {
      title,
      description,
      about,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
      assigneeEmail,
      assignerId,
      completedAt
    } = req.body || {};

    if (!title || typeof title !== 'string') {
      const error = new Error('Task title is required');
      error.statusCode = 400;
      throw error;
    }

    // Support rich-text HTML (frontend uses Quill). Also accept "about" alias.
    const richDescription =
      typeof description === 'string'
        ? description
        : (typeof about === 'string' ? about : null);

    const normalizedPriority = normalizeTaskPriority(priority);
    const normalizedStatus = normalizeTaskStatus(status);

    let resolvedAssigneeId = assigneeId || null;
    if (!resolvedAssigneeId && assigneeEmail) {
      const email = String(assigneeEmail).trim().toLowerCase();
      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('Assignee not found');
        error.statusCode = 400;
        throw error;
      }
      resolvedAssigneeId = user.id;
    }

    // If projectId is present and we have an assignee, ensure they belong to the project.
    if (projectId && resolvedAssigneeId) {
      const membership = await projectMemberRepository.findOne({
        project_id: String(projectId),
        user_id: String(resolvedAssigneeId)
      });
      if (!membership) {
        const error = new Error('Assignee is not a member of this project');
        error.statusCode = 400;
        throw error;
      }
    }

    const payload = {
      title,
      description: richDescription || null,
      status: normalizedStatus !== undefined ? normalizedStatus : (status || null),
      priority: normalizedPriority !== undefined ? normalizedPriority : (priority || null),
      due_date: dueDate || null,
      project_id: projectId || null,
      assignee_id: resolvedAssigneeId ? String(resolvedAssigneeId) : null,
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

    // Attach safe assignee info for UI (email/name) when possible
    const assigneeIds = Array.from(
      new Set((tasks || []).map((t) => t.assignee_id).filter(Boolean).map(String))
    );
    const assignees = assigneeIds.length > 0 ? await userRepository.findManyByIds(assigneeIds) : [];
    const assigneesById = new Map(assignees.map((u) => [String(u.id), u]));

    const withAssignee = (tasks || []).map((task) => ({
      ...task,
      assignee: task.assignee_id ? (assigneesById.get(String(task.assignee_id)) || null) : null
    }));

    return { data: withAssignee };
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
      ...(status !== undefined ? { status: normalizeTaskStatus(status) } : {}),
      ...(priority !== undefined ? { priority: normalizeTaskPriority(priority) } : {}),
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


