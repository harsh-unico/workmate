'use strict';

const { ZodError } = require('zod');
const { NODE_ENV } = require('../config/env');

function parsePagination(query) {
  const limit = query.limit !== undefined ? Math.max(0, Number(query.limit)) : undefined;
  const offset = query.offset !== undefined ? Math.max(0, Number(query.offset)) : undefined;
  const orderBy = query.orderBy || 'created_at';
  const ascending = query.ascending === 'true' || query.ascending === true;
  return { limit, offset, orderBy, ascending };
}

function sendOk(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

function sendError(res, error) {
  // Always log full error on server
  // eslint-disable-next-line no-console
  console.error('API error:', error);
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, error: 'ValidationError', details: error.flatten() });
    return;
  }
  // Try to unwrap Supabase/PostgREST error objects
  const base = typeof error === 'object' && error !== null ? error : {};
  const status = Number(base.status) || 500;
  let message = base.message || base.error || '';
  const details = base.details || base.hint || base.code || undefined;
  if (!message) message = details || 'Unexpected error';
  const payload = { success: false, error: String(message) };
  if (NODE_ENV !== 'production') payload.details = details || base; // helpful for local debugging
  res.status(status >= 400 && status <= 599 ? status : 500).json(payload);
}

module.exports = { parsePagination, sendOk, sendError };


