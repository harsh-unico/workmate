'use strict';

const bcrypt = require('bcryptjs');

const DEFAULT_SALT_ROUNDS = 12;

async function hashPassword(plain, saltRounds = DEFAULT_SALT_ROUNDS) {
  if (typeof plain !== 'string' || plain.length < 6) {
    const err = new Error('Password must be a string of length >= 6');
    err.status = 400;
    throw err;
  }
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plain, salt);
}

async function verifyPassword(plain, hash) {
  if (!hash) return false;
  return await bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, verifyPassword };











