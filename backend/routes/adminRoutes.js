import express from 'express';
import {
  fetchStats,
  fetchUsers,
  fetchUserById,
  createUserAdmin,
  fetchStores,
  fetchStoreById,
  createStoreAdmin
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// all admin routes require auth + admin role
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/stats', fetchStats);

router.get('/users', fetchUsers);
router.get('/users/:id', fetchUserById);
router.post('/users', createUserAdmin);

router.get('/stores', fetchStores);
router.get('/stores/:id', fetchStoreById);
router.post('/stores', createStoreAdmin);

export default router;
