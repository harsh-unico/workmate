'use strict';

const repo = require('../repositories/commentRepository');
const { InsertSchema, UpdateSchema } = require('../models/comment');
const { parsePagination, sendOk, sendError } = require('./utils');

async function addComment(req, res) {
  try {
    const payload = InsertSchema.parse(req.body || {});
    const data = await repo.create(payload);
    sendOk(res, data, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function getComment(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.getById(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function listComments(req, res) {
  try {
    const { limit, offset, orderBy, ascending } = parsePagination(req.query || {});
    const filter = {};
    if (req.query.task_id !== undefined) filter.task_id = Number(req.query.task_id);
    if (req.query.author_id !== undefined) filter.author_id = Number(req.query.author_id);
    const result = await repo.list(filter, { limit, offset, orderBy, ascending });
    sendOk(res, result);
  } catch (err) {
    sendError(res, err);
  }
}

async function updateComment(req, res) {
  try {
    const id = Number(req.params.id);
    const changes = UpdateSchema.parse(req.body || {});
    const data = await repo.update(id, changes);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

async function deleteComment(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await repo.remove(id);
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = {
  addComment,
  getComment,
  listComments,
  updateComment,
  deleteComment
};


