'use strict';

const express = require('express');

const projectController = require('../controllers/projectController');
const {
  createProjectValidator,
  updateProjectValidator
} = require('../validators/projectValidators');
const { handleValidation } = require('../validators');

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.post('/', createProjectValidator, handleValidation, projectController.createProject);
router.get('/:id', projectController.getProjectDetails);
router.put('/:id', updateProjectValidator, handleValidation, projectController.updateProject);

router.get('/:projectId/tasks', projectController.getProjectTasks);
router.get('/:projectId/members', projectController.getProjectMembers);

module.exports = router;


