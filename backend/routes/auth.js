import express from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../db.js';

const router = express.Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   POST /api/auth/register
 * @desc    Register a Normal User (Name, Email, Address, Password)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // Server-side validations
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full Name must be at least 2 characters.';
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!address || address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters.';
    }

    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check if email already registered
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        errors: { email: 'Email is already registered.' }
      });
    }

    // Hash password with bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in PostgreSQL database
    const newUser = await createUser({
      name,
      email,
      address,
      passwordHash
    });

    console.log(`[AUTH API] Registered new Normal User: ${newUser.email} (ID: ${newUser.id})`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your account has been created.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
        createdAt: newUser.created_at || newUser.createdAt
      }
    });

  } catch (error) {
    console.error('[AUTH API] Error in /register:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login User
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    console.log(`[AUTH API] User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('[AUTH API] Error in /login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
});

/**
 * @route   GET /api/auth/health
 * @desc    Health check for auth service
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-api', timestamp: new Date().toISOString() });
});

export default router;
