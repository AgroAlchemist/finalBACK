import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
// User (Buyer) routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:userId', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;