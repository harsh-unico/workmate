'use strict';

const express = require('express');

const authRoutes = require('./auth.routes');
const orgRoutes = require('./org.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orgs', orgRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;


