import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById, getAllUsers } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ratehub_jwt_secret_key_2026';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!address || address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters.';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    const assignedRole = ['admin', 'store_owner', 'user'].includes(role) ? role : 'user';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        errors: { email: 'Email is already registered.' }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser({ name, email, address, passwordHash, role: assignedRole });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
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
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role: requestedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // check that user's actual role matches the role they picked on the login form
    if (requestedRole && requestedRole !== user.role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${requestedRole}'.`
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

export async function getUsersAdmin(req, res) {
  try {
    const users = await getAllUsers();
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
