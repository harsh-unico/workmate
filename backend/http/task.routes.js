'use strict';

const express = require('express');

const taskController = require('../controllers/taskController');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidators');
const { handleValidation } = require('../validators');

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.post('/', createTaskValidator, handleValidation, taskController.createTask);
router.get('/:id', taskController.getTaskDetails);
router.put('/:id', updateTaskValidator, handleValidation, taskController.updateTask);

module.exports = router;


