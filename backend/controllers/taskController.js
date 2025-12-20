'use strict';

const taskService = require('../services/taskService');

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

function getAllTasks(req, res) {
  const { projectId, status } = req.query;
  return handle(() => taskService.getAllTasks({ projectId, status }), req, res);
}

function createTask(req, res) {
  return handle(() => taskService.createTask(req.body), req, res);
}

function updateTask(req, res) {
  const { id } = req.params;
  return handle(() => taskService.updateTask(id, req.body), req, res);
}

function getTaskDetails(req, res) {
  const { id } = req.params;
  return handle(() => taskService.getTaskById(id), req, res);
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  getTaskDetails
};


