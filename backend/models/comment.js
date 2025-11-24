'use strict';

const { z } = require('zod');
// no enums needed for this model

const TABLE = 'comments';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  taskId: 'task_id',
  authorId: 'author_id',
  body: 'body',
  mentions: 'mentions',
  updatedAt: 'updated_at',
  attachmentUrl: 'attachment_url',
  attachmentName: 'attachment_name'
});

const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  task_id: z.number(),
  author_id: z.number(),
  body: z.string(),
  mentions: z.array(z.string()).nullable().optional(),
  updated_at: z.string().nullable().optional(),
  attachment_url: z.string().url().nullable().optional(),
  attachment_name: z.string().nullable().optional()
});

const InsertSchema = z.object({
  task_id: z.number(),
  author_id: z.number(),
  body: z.string(),
  mentions: z.array(z.string()).nullable().optional(),
  updated_at: z.string().nullable().optional(),
  attachment_url: z.string().url().nullable().optional(),
  attachment_name: z.string().nullable().optional()
});

const UpdateSchema = InsertSchema.partial();

const MUTABLE_FIELDS = [
  'task_id',
  'author_id',
  'body',
  'mentions',
  'updated_at',
  'attachment_url',
  'attachment_name'
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


