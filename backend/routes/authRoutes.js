import express from 'express';
import { register, login, getProfile, getUsersAdmin } from '../controllers/authController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Protected Profile Route (Any Authenticated User)
router.get('/me', verifyToken, getProfile);

// Protected Admin-Only Route
router.get('/admin/users', verifyToken, authorizeRoles('admin'), getUsersAdmin);

// Health Endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-mvc-api', timestamp: new Date().toISOString() });
});

export default router;
