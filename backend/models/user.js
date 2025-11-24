'use strict';

const { z } = require('zod');
const { userStatusValues } = require('../enums');

const TABLE = 'users';
const COLUMNS = Object.freeze({
  id: 'id',
  createdAt: 'created_at',
  name: 'name',
  email: 'email',
  passwordHash: 'password_hash',
  role: 'role',
  department: 'department',
  profileImageUrl: 'profile_image_url',
  status: 'status',
  isAdmin: 'is_admin',
  updatedAt: 'updated_at',
  orgId: 'org_id'
});

const RowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  status: z.enum(userStatusValues).nullable().optional(),
  is_admin: z.boolean().default(false),
  updated_at: z.string().nullable().optional(),
  org_id: z.array(z.number()).nullable().optional()
});

const InsertSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  status: z.enum(userStatusValues).nullable().optional(),
  is_admin: z.boolean().optional(),
  org_id: z.array(z.number()).nullable().optional(),
  updated_at: z.string().nullable().optional()
});

const UpdateSchema = InsertSchema.partial();

// For repository compatibility
const MUTABLE_FIELDS = [
  'name',
  'email',
  'password_hash',
  'role',
  'department',
  'profile_image_url',
  'status',
  'is_admin',
  'org_id',
  'updated_at'
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


