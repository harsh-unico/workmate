'use strict';

const nodemailer = require('nodemailer');

const { supabase, supabaseAdmin } = require('../config/supabase');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  FRONTEND_RESET_PASSWORD_URL
} = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/password');
const { USER_STATUS } = require('../enums');

const dbAuth = supabase;
const adminAuth = supabaseAdmin;

// Simple in-memory OTP store for signup flow.
// In production, consider persisting this in a dedicated table.
const signupOtps = new Map(); // key: email, value: { otp, expiresAt, password, name, isAdmin }

function getMailer() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is missing in environment variables');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSignupOtp({ email, password, name, isAdmin }) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  signupOtps.set(email, { otp, expiresAt, password, name, isAdmin: !!isAdmin });

  const transporter = getMailer();
  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: email,
    subject: 'Your Workmate signup OTP',
    text: `Your OTP for Workmate signup is ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP for Workmate signup is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  });

  return { message: 'OTP sent successfully' };
}

async function verifySignupOtp({ email, otp }) {
  const entry = signupOtps.get(email);
  if (!entry) {
    throw new Error('No OTP request found for this email or it has expired');
  }

  if (Date.now() > entry.expiresAt) {
    signupOtps.delete(email);
    throw new Error('OTP has expired. Please request a new one.');
  }

  if (entry.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (!adminAuth) {
    throw new Error('Supabase admin client is not configured (service role key missing)');
  }

  // Create user directly via admin API and mark email as confirmed
  const { data, error } = await adminAuth.auth.admin.createUser({
    email,
    password: entry.password,
    email_confirm: true
  });

  if (error) {
    throw new Error(error.message || 'Failed to sign up user with Supabase');
  }

  const passwordHash = await hashPassword(entry.password);

  await userRepository.insertOne({
    email,
    name: entry.name || null,
    password_hash: passwordHash,
    profile_image_url: null,
    status: USER_STATUS.ACTIVE,
    updated_at: null,
    is_admin: !!entry.isAdmin
  });

  signupOtps.delete(email);

  return {
    message: 'Signup successful',
    user: data.user
  };
}

async function login({ email, password }) {
  if (!dbAuth) {
    throw new Error('Supabase auth client is not configured');
  }

  const { data, error } = await dbAuth.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data || !data.session) {
    const message = error && error.message ? error.message : 'Invalid email or password';
    const authError = new Error(message);
    authError.statusCode = 401;
    throw authError;
  }

  const userRecord = await userRepository.findByEmail(email);

  if (!userRecord) {
    const notFoundError = new Error('User profile not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  return {
    message: 'Login successful',
    session: data.session,
    user: data.user,
    profile: userRecord
  };
}

async function forgotPassword({ email }) {
  if (!adminAuth) {
    throw new Error('Supabase admin client is not configured (service role key missing)');
  }

  const redirectTo = FRONTEND_RESET_PASSWORD_URL;
  if (!redirectTo) {
    throw new Error('FRONTEND_RESET_PASSWORD_URL is not configured in environment');
  }

  const { error } = await adminAuth.auth.resetPasswordForEmail(email, {
    redirectTo
  });

  if (error) {
    throw new Error(error.message || 'Failed to send reset password email');
  }

  return { message: 'Password reset email sent' };
}

async function resetPassword({ email, newPassword, token }) {
  if (!dbAuth || !adminAuth) {
    throw new Error('Supabase auth clients are not properly configured');
  }

  // Verify the reset token and fetch the Supabase user
  const { data: userData, error: getUserError } = await dbAuth.auth.getUser(token);
  if (getUserError || !userData || !userData.user) {
    throw new Error('Invalid or expired password reset token');
  }

  const supabaseUser = userData.user;
  if (supabaseUser.email !== email) {
    throw new Error('Email does not match reset token');
  }

  const { error: updateAuthError } = await adminAuth.auth.admin.updateUserById(
    supabaseUser.id,
    {
      password: newPassword
    }
  );

  if (updateAuthError) {
    throw new Error(updateAuthError.message || 'Failed to update password in Supabase auth');
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updatePasswordHashByEmail(email, passwordHash);

  return { message: 'Password has been reset successfully' };
}

module.exports = {
  sendSignupOtp,
  verifySignupOtp,
  login,
  forgotPassword,
  resetPassword
};


