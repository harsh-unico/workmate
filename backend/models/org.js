'use strict';

const { z } = require('zod');
const { orgSizeValues } = require('../enums');

// Table and columns
const TABLE = 'orgs';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  ownerId: 'owner_id',
  description: 'description',
  size: 'size'
});

// Row and mutation schemas
const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  owner_id: z.number(),
  description: z.string().nullable().optional(),
  size: z.enum(orgSizeValues).nullable().optional()
});

const InsertSchema = z.object({
  owner_id: z.number(),
  description: z.string().nullable().optional(),
  size: z.enum(orgSizeValues).nullable().optional()
});

const UpdateSchema = InsertSchema.partial();

// For backward compatibility with repositories
const MUTABLE_FIELDS = ['owner_id', 'description', 'size'];

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


