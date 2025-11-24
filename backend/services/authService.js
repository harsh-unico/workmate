'use strict';

const { supabase, supabaseAdmin } = require('../config/supabase');

// After OTP verification, create the Supabase user
async function createUserAfterOtp(payload) {
  const email = String(payload?.email || '').trim();
  const password = String(payload?.password || '');
  const userMetadata = payload?.metadata || undefined;

  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata
    });
    if (error) {
      error.status = error.status || 400;
      throw error;
    }
    return { user: data?.user || null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: userMetadata ? { data: userMetadata } : undefined
  });
  if (error) {
    error.status = error.status || 400;
    throw error;
  }
  return data; // { user, session }
}

async function login(payload) {
	const email = String(payload?.email || '').trim();
	const password = String(payload?.password || '');
	if (!email || !password) {
		const err = new Error('Email and password are required');
		err.status = 400;
		throw err;
	}
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		error.status = error.status || 401;
		throw error;
	}
	return data; // { user, session }
}

module.exports = { createUserAfterOtp, login };



