'use strict';

const repo = require('../repositories/notificationRepository');
const { InsertSchema, UpdateSchema } = require('../models/notification');
const { parsePagination, sendOk, sendError } = require('./utils');
const { supabase, supabaseAdmin } = require('../config/supabase');

async function createNotification(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getNotification(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listNotifications(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.user_id !== undefined) filter.user_id = Number(req.query.user_id);
    if (req.query.is_read !== undefined) filter.is_read = String(req.query.is_read) === 'true';
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateNotification(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteNotification(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function markRead(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.update(id, { is_read: true });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function markAllReadForUser(req, res) {
  try {
    const userId = Number(req.params.userId);
    const db = supabaseAdmin || supabase;
    const { data, error } = await db.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false).select('*');
    if (error) throw error;
    sendOk(res, { updated: data?.length || 0 });
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = {
  createNotification,
  getNotification,
  listNotifications,
  updateNotification,
  deleteNotification,
  markRead,
  markAllReadForUser
};


