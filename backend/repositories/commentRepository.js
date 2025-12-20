'use strict';

const { createRepository } = require('./baseRepository');
const Comment = require('../models/comment');

module.exports = createRepository({
  table: Comment.TABLE,
  rowSchema: Comment.RowSchema,
  insertSchema: Comment.InsertSchema,
  updateSchema: Comment.UpdateSchema,
  mutableFields: Comment.MUTABLE_FIELDS
});


