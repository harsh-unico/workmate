'use strict';

const { createRepository } = require('./baseRepository');
const Org = require('../models/org');

module.exports = createRepository({
  table: Org.TABLE,
  rowSchema: Org.RowSchema,
  insertSchema: Org.InsertSchema,
  updateSchema: Org.UpdateSchema,
  mutableFields: Org.MUTABLE_FIELDS
});


