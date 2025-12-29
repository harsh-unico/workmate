'use strict';

const { createRepository } = require('./baseRepository');
const Task = require('../models/task');

const base = createRepository({
  table: Task.TABLE,
  rowSchema: Task.RowSchema,
  insertSchema: Task.InsertSchema,
  updateSchema: Task.UpdateSchema,
  mutableFields: Task.MUTABLE_FIELDS
});

const { supabase, supabaseAdmin } = require('../config/supabase');
const db = supabaseAdmin || supabase;

async function countByProjectIds(projectIds) {
  const ids = Array.from(new Set((projectIds || []).filter(Boolean).map(String)));
  if (ids.length === 0) return 0;

  const { count, error } = await db
    .from(base.table)
    .select('id', { count: 'exact', head: true })
    .in('project_id', ids);
  if (error) throw error;
  return count || 0;
}

module.exports = {
  ...base,
  countByProjectIds
};


