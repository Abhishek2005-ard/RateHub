import express from 'express';
import {
  fetchStats,
  fetchUsers,
  fetchUserById,
  createUserAdmin,
  fetchStores,
  createStoreAdmin
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply JWT verification and strict Admin role authorization to all admin endpoints
router.use(verifyToken);
router.use(authorizeRoles('admin'));

// Admin Dashboard Aggregated Statistics
router.get('/stats', fetchStats);

// User Management Routes
router.get('/users', fetchUsers);
router.get('/users/:id', fetchUserById);
router.post('/users', createUserAdmin);

// Store Management Routes
router.get('/stores', fetchStores);
router.post('/stores', createStoreAdmin);

export default router;

