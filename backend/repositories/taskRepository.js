'use strict';

const { supabase, supabaseAdmin } = require('../config/supabase');
const { TABLE, MUTABLE_FIELDS } = require('../models/task');

const db = supabaseAdmin || supabase;

function pick(input, allowed) {
  const output = {};
  if (!input) return output;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined) {
      output[key] = input[key];
    }
  }
  return output;
}

async function create(payload) {
  const insert = pick(payload, MUTABLE_FIELDS);
  const { data, error } = await db.from(TABLE).insert(insert).select().single();
  if (error) throw error;
  return data;
}

async function getById(id) {
  const { data, error } = await db.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

async function list(filter = {}, options = {}) {
  const { limit, offset, orderBy = 'created_at', ascending = false } = options;
  let query = db.from(TABLE).select('*', { count: 'exact' });
  if (filter && Object.keys(filter).length) query = query.match(filter);
  if (orderBy) query = query.order(orderBy, { ascending });
  if (typeof limit === 'number') {
    const from = typeof offset === 'number' ? offset : 0;
    const to = from + limit - 1;
    query = query.range(from, to);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

async function update(id, changes) {
  const updates = pick(changes, MUTABLE_FIELDS);
  const { data, error } = await db.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function remove(id) {
  const { data, error } = await db.from(TABLE).delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
}

module.exports = { create, getById, list, update, remove };


