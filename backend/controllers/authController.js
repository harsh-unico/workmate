'use strict';

const { z } = require('zod');
const authService = require('../services/authService');
const { sendWelcomeEmail } = require('../services/emailService');
const otpService = require('../services/otpService');
const { hashPassword } = require('../services/passwordService');
const userRepo = require('../repositories/userRepositorry');
const { sendOk, sendError } = require('./utils');

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  metadata: z.record(z.any()).optional()
});

async function signup(req, res) {
  try {
    const payload = CredentialsSchema.parse(req.body || {});
    await otpService.generateAndSend(payload.email);
    sendOk(res, { message: 'OTP sent to email' }, 201);
  } catch (err) {
    sendError(res, err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = CredentialsSchema.omit({ metadata: true }).parse(req.body || {});
    const pending = await otpService.hasPendingOtp(email);
    if (pending) {
      const e = new Error('Complete OTP verification before logging in');
      e.status = 403;
      throw e;
    }
    const data = await authService.login({ email, password });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  password: z.string().min(6),
  metadata: z.record(z.any()).optional()
});

async function verifyOtp(req, res) {
  try {
    const { email, code, password, metadata } = VerifySchema.parse(req.body || {});
    await otpService.verify(email, code);
    await authService.createUserAfterOtp({ email, password, metadata });
    // Create or update local users row with password hash
    const password_hash = await hashPassword(password);
    const displayName = (metadata && typeof metadata.name === 'string' && metadata.name.trim()) || email.split('@')[0];
    const existing = await userRepo.getByEmail(email);
    if (existing) {
      await userRepo.update(existing.id, { password_hash, name: existing.name || displayName });
    } else {
      await userRepo.create({ email, name: displayName, password_hash });
    }
    // Fire-and-forget welcome email; don't block auth on email failures
    sendWelcomeEmail(email, metadata?.name).catch(() => {});
    const data = await authService.login({ email, password });
    sendOk(res, data);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { signup, login, verifyOtp };



