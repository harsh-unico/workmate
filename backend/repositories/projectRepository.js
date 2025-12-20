'use strict';

const { createRepository } = require('./baseRepository');
const Project = require('../models/project');

module.exports = createRepository({
  table: Project.TABLE,
  rowSchema: Project.RowSchema,
  insertSchema: Project.InsertSchema,
  updateSchema: Project.UpdateSchema,
  mutableFields: Project.MUTABLE_FIELDS
});


