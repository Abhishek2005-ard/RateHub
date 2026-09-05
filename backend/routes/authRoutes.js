import express from 'express';
import { register, login, getProfile, getUsersAdmin } from '../controllers/authController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, getProfile);
router.get('/admin/users', verifyToken, authorizeRoles('admin'), getUsersAdmin);

export default router;
