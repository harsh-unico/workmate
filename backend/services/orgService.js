'use strict';

const orgRepository = require('../repositories/orgRepository');
const projectRepository = require('../repositories/projectRepository');
const orgMemberRepository = require('../repositories/orgMemberRepository');

function nowIso() {
  return new Date().toISOString();
}

async function getAllOrganisations() {
  return orgRepository.findMany();
}

async function createOrganisation(payload) {
  const data = {
    org_name: payload.orgName,
    email: payload.email || null,
    phone: payload.phone || null,
    address_line_1: payload.addressLine1 || null,
    address_line_2: payload.addressLine2 || null,
    country: payload.country || null,
    state: payload.state || null,
    city: payload.city || null,
    postal_code: payload.postalCode || null,
    about: payload.about || null,
    updated_at: nowIso()
  };

  // First create the organisation
  const organisation = await orgRepository.insertOne(data);

  // If a userId is provided, automatically add them as a member (admin by default)
  if (payload.userId && organisation && organisation.id) {
    await orgMemberRepository.insertOne({
      org_id: organisation.id,
      user_id: payload.userId,
      department: payload.department || null,
      is_admin: true
    });
  }

  return organisation;
}

async function updateOrganisation(id, payload) {
  const data = {
    org_name: payload.orgName,
    email: payload.email,
    phone: payload.phone,
    address_line_1: payload.addressLine1,
    address_line_2: payload.addressLine2,
    country: payload.country,
    state: payload.state,
    city: payload.city,
    postal_code: payload.postalCode,
    about: payload.about,
    updated_at: nowIso()
  };

  return orgRepository.updateById(id, data);
}

async function getOrganisationProjects(orgId) {
  return projectRepository.findMany({ org_id: orgId });
}

async function getOrganisationMembers(orgId) {
  return orgMemberRepository.findMany({ org_id: orgId });
}

module.exports = {
  getAllOrganisations,
  createOrganisation,
  updateOrganisation,
  getOrganisationProjects,
  getOrganisationMembers
};


