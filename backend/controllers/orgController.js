'use strict';

const orgService = require('../services/orgService');

async function handle(controllerFn, req, res) {
  try {
    const result = await controllerFn(req, res);
    if (!res.headersSent) {
      res.json(result);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    const status = err.statusCode || 400;
    res.status(status).json({
      error: err.message || 'Unexpected error'
    });
  }
}

function getAllOrganisations(req, res) {
  return handle(() => orgService.getAllOrganisations(), req, res);
}

function createOrganisation(req, res) {
  return handle(() => orgService.createOrganisation(req.body), req, res);
}

function updateOrganisation(req, res) {
  const { id } = req.params;
  return handle(() => orgService.updateOrganisation(id, req.body), req, res);
}

function getOrganisationProjects(req, res) {
  const { orgId } = req.params;
  return handle(() => orgService.getOrganisationProjects(orgId), req, res);
}

function getOrganisationMembers(req, res) {
  const { orgId } = req.params;
  return handle(() => orgService.getOrganisationMembers(orgId), req, res);
}

module.exports = {
  getAllOrganisations,
  createOrganisation,
  updateOrganisation,
  getOrganisationProjects,
  getOrganisationMembers
};


