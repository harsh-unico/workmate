'use strict';

const { createRepository } = require('./baseRepository');
const ProjectMember = require('../models/projectMember');

const base = createRepository({
  table: ProjectMember.TABLE,
  rowSchema: ProjectMember.RowSchema,
  insertSchema: ProjectMember.InsertSchema,
  updateSchema: ProjectMember.UpdateSchema,
  mutableFields: ProjectMember.MUTABLE_FIELDS
});

const { supabase, supabaseAdmin } = require('../config/supabase');
const db = supabaseAdmin || supabase;

async function findAdminProjectIdsForUser(userId, { roles } = {}) {
  const uid = userId ? String(userId) : null;
  if (!uid) return [];

  const roleList = Array.isArray(roles) ? roles.filter(Boolean).map(String) : [];
  if (roleList.length === 0) return [];

  const { data, error } = await db
    .from(base.table)
    .select('project_id')
    .eq('user_id', uid)
    .in('role', roleList);

  if (error) throw error;
  return Array.from(new Set((data || []).map((r) => r.project_id).filter(Boolean)));
}

module.exports = {
  ...base,
  findAdminProjectIdsForUser
};


