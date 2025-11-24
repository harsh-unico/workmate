'use strict';

const { z } = require('zod');
const { projectStatusValues, projectPriorityValues } = require('../enums');

const TABLE = 'projects';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  orgId: 'org_id',
  name: 'name',
  description: 'description',
  startDate: 'start_date',
  endDate: 'end_date',
  status: 'status',
  teamLeadId: 'team_lead_id',
  priority: 'priority',
  projectManagerId: 'project_manager_id',
  team: 'team'
});

const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  org_id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.enum(projectStatusValues).nullable().optional(),
  team_lead_id: z.number().nullable().optional(),
  priority: z.enum(projectPriorityValues).nullable().optional(),
  project_manager_id: z.number().nullable().optional(),
  team: z.array(z.number()).nullable().optional()
});

const InsertSchema = z.object({
  org_id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.enum(projectStatusValues).nullable().optional(),
  team_lead_id: z.number().nullable().optional(),
  priority: z.enum(projectPriorityValues).nullable().optional(),
  project_manager_id: z.number().nullable().optional(),
  team: z.array(z.number()).nullable().optional()
});

const UpdateSchema = InsertSchema.partial();

const MUTABLE_FIELDS = [
  'org_id',
  'name',
  'description',
  'start_date',
  'end_date',
  'status',
  'team_lead_id',
  'priority',
  'project_manager_id',
  'team'
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


