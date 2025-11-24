'use strict';

const repo = require('../repositories/orgRepository');
const { InsertSchema, UpdateSchema } = require('../models/org');
const { parsePagination, sendOk, sendError } = require('./utils');

async function createOrg(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getOrg(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listOrgs(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.owner_id !== undefined) filter.owner_id = Number(req.query.owner_id);
    if (req.query.size) filter.size = req.query.size;
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateOrg(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteOrg(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { createOrg, getOrg, listOrgs, updateOrg, deleteOrg };


