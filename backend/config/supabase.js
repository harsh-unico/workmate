'use strict';

const { createClient } = require('@supabase/supabase-js');
const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY
} = require('./env');

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

// Public client (use anon key)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Server-side admin client (if service role key is provided)
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : null;

module.exports = { supabase, supabaseAdmin };


