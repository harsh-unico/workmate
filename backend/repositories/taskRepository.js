'use strict';

const { createRepository } = require('./baseRepository');
const Task = require('../models/task');

module.exports = createRepository({
  table: Task.TABLE,
  rowSchema: Task.RowSchema,
  insertSchema: Task.InsertSchema,
  updateSchema: Task.UpdateSchema,
  mutableFields: Task.MUTABLE_FIELDS
});


