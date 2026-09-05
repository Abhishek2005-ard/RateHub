import bcrypt from 'bcryptjs';
import { getAllUsers, createUser, findUserByEmail, findUserById } from '../models/userModel.js';
import { getAllStores, createStore, getAdminStats, findStoreById } from '../models/storeModel.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function fetchStats(req, res) {
  try {
    const stats = await getAdminStats();
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch statistics.' });
  }
}

export async function fetchUsers(req, res) {
  try {
    const { search, role, page, limit } = req.query;
    const result = await getAllUsers({ search, role, page, limit });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
}

export async function fetchUserById(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
}

export async function createUserAdmin(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email || !EMAIL_REGEX.test(email.trim())) errors.email = 'Invalid email address.';
    if (!address || address.trim().length < 5) errors.address = 'Address must be at least 5 characters.';
    if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation error', errors });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser({ name, email, address, passwordHash, role: role || 'user' });

    return res.status(201).json({
      success: true,
      message: `User '${newUser.name}' created successfully.`,
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
}

export async function fetchStores(req, res) {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getAllStores({ search, category, page, limit });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stores.' });
  }
}

export async function fetchStoreById(req, res) {
  try {
    const store = await findStoreById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }
    return res.status(200).json({ success: true, store });
  } catch (error) {
    console.error('Error fetching store:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch store details.' });
  }
}

export async function createStoreAdmin(req, res) {
  try {
    const { name, email, address, category } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) errors.name = 'Store name must be at least 2 characters.';
    if (!email || !EMAIL_REGEX.test(email.trim())) errors.email = 'Invalid email address.';
    if (!address || address.trim().length < 5) errors.address = 'Address must be at least 5 characters.';
    if (!category || category.trim().length < 2) errors.category = 'Category is required.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation error', errors });
    }

    const newStore = await createStore({ name, email, address, category });

    return res.status(201).json({
      success: true,
      message: `Store '${newStore.name}' created.`,
      store: newStore
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return res.status(500).json({ success: false, message: 'Failed to create store.' });
  }
}
