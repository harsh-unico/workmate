'use strict';

const { body } = require('express-validator');
const { PROJECT_STATUS } = require('../enums');

const allowedProjectStatuses = Object.values(PROJECT_STATUS);

const createProjectValidator = [
  body('name').isString().notEmpty().withMessage('Project name is required'),
  body('orgId').optional().isString(),
  body('description').optional().isString(),
  body('startDate').optional().isString(),
  body('endDate').optional().isString(),
  body('userId').isString().notEmpty().withMessage('userId is required'),
  body('status')
    .optional()
    .isIn(allowedProjectStatuses)
    .withMessage(`Status must be one of: ${allowedProjectStatuses.join(', ')}`),
  body('createdBy').optional().isString()
];

const updateProjectValidator = [
  body('name').optional().isString(),
  body('orgId').optional().isString(),
  body('description').optional().isString(),
  body('startDate').optional().isString(),
  body('endDate').optional().isString(),
  body('status')
    .optional()
    .isIn(allowedProjectStatuses)
    .withMessage(`Status must be one of: ${allowedProjectStatuses.join(', ')}`),
  body('createdBy').optional().isString()
];

module.exports = {
  createProjectValidator,
  updateProjectValidator
};


