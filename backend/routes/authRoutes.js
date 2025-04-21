import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
    manageCommittee,
    updateUserStatus
} from '../controllers/authcontroller.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

// Admin routes
router.put('/committee/:id', protect, manageCommittee);
router.put('/status/:id', protect, admin, updateUserStatus);

export default router; 