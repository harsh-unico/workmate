'use strict';

const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    const err = new Error('Missing SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS)');
    err.status = 500;
    throw err;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

async function sendOtpEmail(to, code) {
  const from = process.env.SMTP_FROM || 'harsh.unico@gmail.com';
  const transporter = getTransporter();
  const subject = 'Your verification code';
  const text = `Your verification code is ${code}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <p>Your verification code is:</p>
      <p style="font-size:20px;font-weight:bold;letter-spacing:2px">${code}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}

async function sendWelcomeEmail(to, displayName) {
  const from = process.env.SMTP_FROM || 'harsh.unico@gmail.com';
  const transporter = getTransporter();
  const subject = 'Welcome to Workmate';
  const name = displayName ? String(displayName).trim() : undefined;
  const text = `Welcome${name ? `, ${name}` : ''}! Glad to have you at Workmate.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 8px">Welcome to Workmate${name ? `, ${name}` : ''}!</h2>
      <p>Your account was created successfully. You're all set to start collaborating.</p>
    </div>
  `;
  await transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendOtpEmail, sendWelcomeEmail };



