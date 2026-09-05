import bcrypt from 'bcryptjs';
import { getAllUsers, createUser, findUserByEmail } from '../models/userModel.js';
import { getAllStores, createStore, getAdminStats } from '../models/storeModel.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Get aggregated admin dashboard statistics
 */
export async function fetchStats(req, res) {
  try {
    const stats = await getAdminStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin statistics.'
    });
  }
}

/**
 * Get all users for admin management with search, role filter, and pagination
 */
export async function fetchUsers(req, res) {
  try {
    const { search, role, page, limit } = req.query;
    const result = await getAllUsers({ search, role, page, limit });
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user list.'
    });
  }
}

/**
 * Get single user details by ID for Admin Details modal
 */
export async function fetchUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user details.'
    });
  }
}

/**
 * Create a new user (Admin access)
 */
export async function createUserAdmin(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full Name must be at least 2 characters.';
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

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      name,
      email,
      address,
      passwordHash,
      role: role || 'user'
    });

    console.log(`[ADMIN CONTROLLER] Created new user: ${newUser.email} (${newUser.role})`);

    return res.status(201).json({
      success: true,
      message: `User '${newUser.name}' created successfully!`,
      user: newUser
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user.'
    });
  }
}

/**
 * Get all stores for admin management
 */
export async function fetchStores(req, res) {
  try {
    const stores = await getAllStores();
    return res.status(200).json({
      success: true,
      count: stores.length,
      stores
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error fetching stores:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve store list.'
    });
  }
}

/**
 * Create a new store (Admin access)
 */
export async function createStoreAdmin(req, res) {
  try {
    const { name, email, address, category } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Store name must be at least 2 characters.';
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid owner/store email address.';
    }

    if (!address || address.trim().length < 5) {
      errors.address = 'Store address must be at least 5 characters.';
    }

    if (!category || category.trim().length < 2) {
      errors.category = 'Store category is required.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    const newStore = await createStore({
      name,
      email,
      address,
      category
    });

    console.log(`[ADMIN CONTROLLER] Created store: ${newStore.name}`);

    return res.status(201).json({
      success: true,
      message: `Store '${newStore.name}' created successfully!`,
      store: newStore
    });
  } catch (error) {
    console.error('[ADMIN CONTROLLER] Error creating store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create store.'
    });
  }
}
