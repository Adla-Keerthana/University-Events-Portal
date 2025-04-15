import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    verifyEmail,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router; 