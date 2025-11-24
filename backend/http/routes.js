'use strict';

const express = require('express');
const router = express.Router();

// Controllers
const users = require('../controllers/userController');
const orgs = require('../controllers/orgController');
const projects = require('../controllers/projectController');
const tasks = require('../controllers/taskController');
const comments = require('../controllers/commentController');
const notifications = require('../controllers/notificationController');
const auth = require('../controllers/authController');
const { supabaseAdmin } = require('../config/supabase');

// Users
router.post('/users', users.createUser);
router.get('/users', users.listUsers);
router.get('/users/:id', users.getUser);
router.patch('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

// Orgs
router.post('/orgs', orgs.createOrg);
router.get('/orgs', orgs.listOrgs);
router.get('/orgs/:id', orgs.getOrg);
router.patch('/orgs/:id', orgs.updateOrg);
router.delete('/orgs/:id', orgs.deleteOrg);

// Projects
router.post('/projects', projects.createProject);
router.get('/projects', projects.listProjects);
router.get('/projects/:id', projects.getProject);
router.patch('/projects/:id', projects.updateProject);
router.delete('/projects/:id', projects.deleteProject);

// Tasks
router.post('/tasks', tasks.createTask);
router.get('/tasks', tasks.listTasks);
router.get('/tasks/:id', tasks.getTask);
router.patch('/tasks/:id', tasks.updateTask);
router.patch('/tasks/:id/assign', tasks.assignTask);
router.patch('/tasks/:id/status', tasks.updateTaskStatus);
router.patch('/tasks/:id/due-date', tasks.updateTaskDueDate);
router.delete('/tasks/:id', tasks.deleteTask);

// Comments
router.post('/comments', comments.addComment);
router.get('/comments', comments.listComments);
router.get('/comments/:id', comments.getComment);
router.patch('/comments/:id', comments.updateComment);
router.delete('/comments/:id', comments.deleteComment);

// Notifications
router.post('/notifications', notifications.createNotification);
router.get('/notifications', notifications.listNotifications);
router.get('/notifications/:id', notifications.getNotification);
router.patch('/notifications/:id', notifications.updateNotification);
router.patch('/notifications/:id/read', notifications.markRead);
router.patch('/users/:userId/notifications/mark-all-read', notifications.markAllReadForUser);
router.delete('/notifications/:id', notifications.deleteNotification);

// Auth
router.post('/auth/signup', auth.signup);
router.post('/auth/login', auth.login);
router.post('/auth/verify-otp', auth.verifyOtp);

// Minimal debug
router.get('/_debug/supabase', (req, res) => {
  res.json({ adminClient: Boolean(supabaseAdmin) });
});

router.post('/_debug/users/insert', async (req, res) => {
  const { supabase, supabaseAdmin } = require('../config/supabase');
  const db = supabaseAdmin || supabase;
  const payload = {
    name: '_debug',
    email: `debug+${Date.now()}@example.com`,
    status: 'active'
  };
  const { data, error, status, statusText } = await db.from('users').insert(payload).select().maybeSingle();
  res.status(error ? 500 : 200).json({ status, statusText, data, error });
});

module.exports = router;


