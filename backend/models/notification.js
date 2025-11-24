'use strict';

const { z } = require('zod');
const { notificationEntityTypeValues } = require('../enums');

const TABLE = 'notifications';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  userId: 'user_id',
  entityType: 'entity_type',
  entityId: 'entity_id',
  title: 'title',
  message: 'message',
  isRead: 'is_read'
});

const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  user_id: z.number(),
  entity_type: z.enum(notificationEntityTypeValues).nullable().optional(),
  entity_id: z.number().nullable().optional(),
  title: z.string(),
  message: z.string().nullable().optional(),
  is_read: z.boolean().default(false)
});

const InsertSchema = z.object({
  user_id: z.number(),
  entity_type: z.enum(notificationEntityTypeValues).nullable().optional(),
  entity_id: z.number().nullable().optional(),
  title: z.string(),
  message: z.string().nullable().optional(),
  is_read: z.boolean().optional()
});

const UpdateSchema = InsertSchema.partial();

const MUTABLE_FIELDS = [
  'user_id',
  'entity_type',
  'entity_id',
  'title',
  'message',
  'is_read'
];

function parseInsert(input) {
  return InsertSchema.parse(input);
}

function parseUpdate(input) {
  return UpdateSchema.parse(input);
}

module.exports = {
  TABLE,
  COLUMNS,
  RowSchema,
  InsertSchema,
  UpdateSchema,
  parseInsert,
  parseUpdate,
  MUTABLE_FIELDS
};


