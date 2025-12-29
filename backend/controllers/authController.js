'use strict';

const authService = require('../services/authService');
const { NODE_ENV } = require('../config/env');
const userRepository = require('../repositories/userRepository');

async function handle(controllerFn, req, res) {
  try {
    const result = await controllerFn(req, res);
    if (!res.headersSent) {
      res.json(result);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    const status = err.statusCode || 400;
    res.status(status).json({
      error: err.message || 'Unexpected error'
    });
  }
}

function signup(req, res) {
  const { email, password, name, isAdmin } = req.body;
  return handle(() => authService.sendSignupOtp({ email, password, name, isAdmin }), req, res);
}

function sendOtp(req, res) {
  const { email, password, name, isAdmin } = req.body;
  return handle(() => authService.sendSignupOtp({ email, password, name, isAdmin }), req, res);
}

function verifyOtp(req, res) {
  const { email, otp } = req.body;
  return handle(() => authService.verifySignupOtp({ email, otp }), req, res);
}

function login(req, res) {
  const { email, password } = req.body;
  return handle(async () => {
    const result = await authService.login({ email, password });

    if (result.session && result.session.access_token) {
      res.cookie('auth_token', result.session.access_token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        // Use Supabase session expiry (in seconds) when available, otherwise 7 days
        maxAge: (result.session.expires_in || 7 * 24 * 60 * 60) * 1000
      });
    }

    return result;
  }, req, res);
}

function forgotPassword(req, res) {
  const { email } = req.body;
  return handle(() => authService.forgotPassword({ email }), req, res);
}

function resetPassword(req, res) {
  const { email, newPassword, token } = req.body;
  return handle(() => authService.resetPassword({ email, newPassword, token }), req, res);
}

function logout(req, res) {
  return handle(() => {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return { message: 'Logged out successfully' };
  }, req, res);
}

function me(req, res) {
  return handle(async () => {
    if (!req.user || !req.user.email) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const profile = await userRepository.findByEmail(req.user.email);
    if (!profile) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }

    return { profile };
  }, req, res);
}

module.exports = {
  signup,
  sendOtp,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
  me
};


