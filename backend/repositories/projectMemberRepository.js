'use strict';

const { createRepository } = require('./baseRepository');
const ProjectMember = require('../models/projectMember');

module.exports = createRepository({
  table: ProjectMember.TABLE,
  rowSchema: ProjectMember.RowSchema,
  insertSchema: ProjectMember.InsertSchema,
  updateSchema: ProjectMember.UpdateSchema,
  mutableFields: ProjectMember.MUTABLE_FIELDS
});


