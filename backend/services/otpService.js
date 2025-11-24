'use strict';

const { supabase, supabaseAdmin } = require('../config/supabase');
const { sendOtpEmail } = require('./emailService');

const OTP_TABLE = 'otps';
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

async function hasPendingOtp(email) {
  const nowIso = new Date().toISOString();
  const db = supabaseAdmin || supabase;
  const { data, error } = await db
    .from(OTP_TABLE)
    .select('id')
    .eq('email', email)
    .eq('consumed', false)
    .gte('expires_at', nowIso)
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error; // ignore no rows
  return Boolean(data);
}

async function generateAndSend(email) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  // Optionally invalidate previous, but not required
  // await supabase.from(OTP_TABLE).delete().eq('email', email).eq('consumed', false);

  const db = supabaseAdmin || supabase;
  const { error } = await db
    .from(OTP_TABLE)
    .insert({ email, code, expires_at: expiresAt, consumed: false });
  if (error) throw error;

  await sendOtpEmail(email, code);
  return { email, expires_at: expiresAt };
}

async function verify(email, code) {
  const nowIso = new Date().toISOString();
  const db = supabaseAdmin || supabase;
  const { data, error } = await db
    .from(OTP_TABLE)
    .select('id, expires_at, consumed')
    .eq('email', email)
    .eq('code', code)
    .eq('consumed', false)
    .gte('expires_at', nowIso)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error; // ignore no rows
  if (!data) {
    const err = new Error('Invalid or expired code');
    err.status = 400;
    throw err;
  }
  const { error: upError } = await db
    .from(OTP_TABLE)
    .update({ consumed: true })
    .eq('id', data.id);
  if (upError) throw upError;
  return { verified: true };
}

module.exports = { generateAndSend, verify, hasPendingOtp };



