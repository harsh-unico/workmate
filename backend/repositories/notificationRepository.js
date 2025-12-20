'use strict';

const { createRepository } = require('./baseRepository');
const Notification = require('../models/notification');

module.exports = createRepository({
  table: Notification.TABLE,
  rowSchema: Notification.RowSchema,
  insertSchema: Notification.InsertSchema,
  updateSchema: Notification.UpdateSchema,
  mutableFields: Notification.MUTABLE_FIELDS
});


