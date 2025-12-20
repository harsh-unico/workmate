'use strict';

const { body } = require('express-validator');

const createOrganisationValidator = [
  body('orgName').isString().notEmpty().withMessage('Organisation name is required'),
  body('userId').isString().notEmpty().withMessage('userId is required'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('phone').optional().isString(),
  body('addressLine1').optional().isString(),
  body('addressLine2').optional().isString(),
  body('country').optional().isString(),
  body('state').optional().isString(),
  body('city').optional().isString(),
  body('postalCode').optional().isString(),
  body('about').optional().isString()
];

const updateOrganisationValidator = [
  body('orgName').optional().isString(),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('phone').optional().isString(),
  body('addressLine1').optional().isString(),
  body('addressLine2').optional().isString(),
  body('country').optional().isString(),
  body('state').optional().isString(),
  body('city').optional().isString(),
  body('postalCode').optional().isString(),
  body('about').optional().isString()
];

module.exports = {
  createOrganisationValidator,
  updateOrganisationValidator
};


