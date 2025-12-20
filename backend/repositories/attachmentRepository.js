'use strict';

const { createRepository } = require('./baseRepository');
const Attachment = require('../models/attachment');

module.exports = createRepository({
  table: Attachment.TABLE,
  rowSchema: Attachment.RowSchema,
  insertSchema: Attachment.InsertSchema,
  updateSchema: Attachment.UpdateSchema,
  mutableFields: Attachment.MUTABLE_FIELDS
});


