'use strict';

const { createRepository } = require('./baseRepository');
const User = require('../models/user');
const { supabase, supabaseAdmin } = require('../config/supabase');

const db = supabaseAdmin || supabase;

const base = createRepository({
  table: User.TABLE,
  rowSchema: User.RowSchema,
  insertSchema: User.InsertSchema,
  updateSchema: User.UpdateSchema,
  mutableFields: User.MUTABLE_FIELDS
});

async function findByEmail(email) {
  const { data, error } = await db.from(User.TABLE).select('*').eq('email', email).maybeSingle();
  if (error && error.code !== 'PGRST116') {
    // PGRST116 = No rows found
    throw error;
  }
  if (!data) return null;
  return User.RowSchema.parse(data);
}

async function updatePasswordHashByEmail(email, passwordHash) {
  const updatePayload = { password_hash: passwordHash };
  const { data, error } = await db
    .from(User.TABLE)
    .update(updatePayload)
    .eq('email', email)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return User.RowSchema.parse(data);
}

module.exports = {
  ...base,
  findByEmail,
  updatePasswordHashByEmail
};


