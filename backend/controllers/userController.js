'use strict';

const repo = require('../repositories/userRepositorry');
const { InsertSchema, UpdateSchema } = require('../models/user');
const { parsePagination, sendOk, sendError } = require('./utils');

async function createUser(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getUser(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listUsers(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.org_id !== undefined) filter.org_id = Number(req.query.org_id);
    if (req.query.status) filter.status = req.query.status;
    if (req.query.is_admin !== undefined) filter.is_admin = String(req.query.is_admin) === 'true';
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = {
  createUser,
  getUser,
  listUsers,
  updateUser,
  deleteUser
};


