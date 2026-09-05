import express from 'express';
import { getUserStores, submitRating } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected user endpoints (requires valid JWT token)
router.use(verifyToken);

router.get('/stores', getUserStores);
router.post('/ratings', submitRating);

export default router;
