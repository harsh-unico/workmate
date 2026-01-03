'use strict';

const express = require('express');

const authRoutes = require('./auth.routes');
const orgRoutes = require('./org.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');
const commentRoutes = require('./comment.routes');
const attachmentRoutes = require('./attachment.routes');
const orgMemberRoutes = require('./orgMember.routes');
const projectMemberRoutes = require('./projectMember.routes');
const userRoutes = require('./user.routes');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use('/auth', authRoutes);
// Everything except auth should require authentication
router.use('/orgs', requireAuth, orgRoutes);
router.use('/projects', requireAuth, projectRoutes);
router.use('/tasks', requireAuth, taskRoutes);
router.use('/comments', requireAuth, commentRoutes);
router.use('/attachments', requireAuth, attachmentRoutes);
router.use('/org-members', requireAuth, orgMemberRoutes);
router.use('/project-members', requireAuth, projectMemberRoutes);
router.use('/users', requireAuth, userRoutes);

module.exports = router;


