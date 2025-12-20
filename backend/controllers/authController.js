'use strict';

const authService = require('../services/authService');

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
  const { email, password, name } = req.body;
  return handle(() => authService.sendSignupOtp({ email, password, name }), req, res);
}

function sendOtp(req, res) {
  const { email, password, name } = req.body;
  return handle(() => authService.sendSignupOtp({ email, password, name }), req, res);
}

function verifyOtp(req, res) {
  const { email, otp } = req.body;
  return handle(() => authService.verifySignupOtp({ email, otp }), req, res);
}

function login(req, res) {
  const { email, password } = req.body;
  return handle(() => authService.login({ email, password }), req, res);
}

function forgotPassword(req, res) {
  const { email } = req.body;
  return handle(() => authService.forgotPassword({ email }), req, res);
}

function resetPassword(req, res) {
  const { email, newPassword, token } = req.body;
  return handle(() => authService.resetPassword({ email, newPassword, token }), req, res);
}

module.exports = {
  signup,
  sendOtp,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword
};


