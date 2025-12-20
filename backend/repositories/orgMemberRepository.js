'use strict';

const { createRepository } = require('./baseRepository');
const OrgMember = require('../models/orgMember');

module.exports = createRepository({
  table: OrgMember.TABLE,
  rowSchema: OrgMember.RowSchema,
  insertSchema: OrgMember.InsertSchema,
  updateSchema: OrgMember.UpdateSchema,
  mutableFields: OrgMember.MUTABLE_FIELDS
});


