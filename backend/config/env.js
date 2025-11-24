'use strict';

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the project root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function readEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === '') return undefined;
  return value;
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const SUPABASE_URL = readEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = readEnv('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = readEnv('SUPABASE_SERVICE_ROLE_KEY');

module.exports = {
  NODE_ENV,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY
};


