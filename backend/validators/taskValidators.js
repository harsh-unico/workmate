'use strict';

const { body } = require('express-validator');
const { TASK_STATUS, TASK_PRIORITY } = require('../enums');

const allowedTaskStatuses = Object.values(TASK_STATUS);
const allowedTaskPriorities = Object.values(TASK_PRIORITY);

const createTaskValidator = [
  body('title').isString().notEmpty().withMessage('Task title is required'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(allowedTaskStatuses)
    .withMessage(`Status must be one of: ${allowedTaskStatuses.join(', ')}`),
  body('priority')
    .optional()
    .isIn(allowedTaskPriorities)
    .withMessage(`Priority must be one of: ${allowedTaskPriorities.join(', ')}`),
  body('dueDate').optional().isString(),
  body('projectId').optional().isString(),
  body('assigneeId').optional().isString(),
  body('assignerId').optional().isString(),
  body('completedAt').optional().isString()
];

const updateTaskValidator = [
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(allowedTaskStatuses)
    .withMessage(`Status must be one of: ${allowedTaskStatuses.join(', ')}`),
  body('priority')
    .optional()
    .isIn(allowedTaskPriorities)
    .withMessage(`Priority must be one of: ${allowedTaskPriorities.join(', ')}`),
  body('dueDate').optional().isString(),
  body('projectId').optional().isString(),
  body('assigneeId').optional().isString(),
  body('assignerId').optional().isString(),
  body('completedAt').optional().isString()
];

module.exports = {
  createTaskValidator,
  updateTaskValidator
};


