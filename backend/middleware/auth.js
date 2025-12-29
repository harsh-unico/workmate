'use strict';

const { supabase } = require('../config/supabase');
const userRepository = require('../repositories/userRepository');

function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  if (authHeader && typeof authHeader === 'string') {
    const [scheme, token] = authHeader.split(' ');
    if (scheme === 'Bearer' && token) {
      return token;
    }
  }

  return null;
}

async function requireAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const email = data.user.email || null;

    // Attach Supabase auth user info to the request. Important:
    // our DB tables (org_members/project_members/etc) reference the app's `users` table,
    // whose primary key is NOT the Supabase auth user id.
    req.user = {
      authId: data.user.id,
      email,
    };

    // Resolve app user profile by email and use its id for DB foreign keys.
    if (email) {
      const profile = await userRepository.findByEmail(email);
      if (!profile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      req.user.id = profile.id; // users.id (NOT supabase auth id)
      req.user.profile = profile;
    }

    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error verifying Supabase token', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function requireAdmin(req, res, next) {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const profile = req.user.profile || (await userRepository.findByEmail(req.user.email));
    if (!profile || !profile.is_admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Optionally attach full profile
    req.user.profile = profile;
    req.user.id = profile.id;
    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error checking admin privileges', err);
    return res.status(500).json({ error: 'Failed to verify admin privileges' });
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
};



