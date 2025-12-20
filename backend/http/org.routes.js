'use strict';

const express = require('express');

const orgController = require('../controllers/orgController');
const {
  createOrganisationValidator,
  updateOrganisationValidator
} = require('../validators/orgValidators');
const { handleValidation } = require('../validators');

const router = express.Router();

router.get('/', orgController.getAllOrganisations);
router.post('/', createOrganisationValidator, handleValidation, orgController.createOrganisation);
router.put('/:id', updateOrganisationValidator, handleValidation, orgController.updateOrganisation);

router.get('/:orgId/projects', orgController.getOrganisationProjects);
router.get('/:orgId/members', orgController.getOrganisationMembers);

module.exports = router;


