'use strict';

const { z } = require('zod');
const { taskStatusValues, taskPriorityValues } = require('../enums');

const TABLE = 'tasks';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  title: 'title',
  description: 'description',
  assigner: 'assigner',
  status: 'status',
  priority: 'priority',
  dueDate: 'due_date',
  projectId: 'project_id',
  assignee: 'assignee',
  attachmentUrl: 'attachment_url',
  attachmentName: 'attachment_name'
});

const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  assigner: z.number().nullable().optional(),
  status: z.enum(taskStatusValues).nullable().optional(),
  priority: z.enum(taskPriorityValues).nullable().optional(),
  due_date: z.string().nullable().optional(),
  project_id: z.number(),
  assignee: z.number().nullable().optional(),
  attachment_url: z.string().url().nullable().optional(),
  attachment_name: z.string().nullable().optional()
});

const InsertSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  assigner: z.number().nullable().optional(),
  status: z.enum(taskStatusValues).nullable().optional(),
  priority: z.enum(taskPriorityValues).nullable().optional(),
  due_date: z.string().nullable().optional(),
  project_id: z.number(),
  assignee: z.number().nullable().optional(),
  attachment_url: z.string().url().nullable().optional(),
  attachment_name: z.string().nullable().optional()
});

const UpdateSchema = InsertSchema.partial();

const MUTABLE_FIELDS = [
  'title',
  'description',
  'assigner',
  'status',
  'priority',
  'due_date',
  'project_id',
  'assignee',
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


