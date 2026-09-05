import express from 'express';
import { getOwnerStoreData, changePassword } from '../controllers/ownerController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Require auth + store_owner role
router.use(verifyToken);
router.use(authorizeRoles('store_owner'));

router.get('/store', getOwnerStoreData);
router.post('/change-password', changePassword);

export default router;
