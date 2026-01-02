'use strict';

const express = require('express');

const projectController = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All project routes are protected
router.get('/admin', requireAuth, projectController.listAdminProjects);
// Get projects created by the given user (projects.created_by = :userId)
router.get('/created-by/:userId', requireAuth, projectController.listProjectsCreatedByUser);
// Get a single project by id (must be a project member)
router.get('/:projectId', requireAuth, projectController.getProjectById);
// Preferred: pass userId in URL so backend can create project_members row
router.post('/:userId', requireAuth, projectController.createProject);
// Backwards compatible: if userId is not provided, we fall back to req.user.id
router.post('/', requireAuth, projectController.createProject);

module.exports = router;



