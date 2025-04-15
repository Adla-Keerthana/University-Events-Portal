import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getNotifications,
    markAsRead,
    deleteNotification,
    getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', protect, getNotifications);

// Get unread notification count
router.get('/unread-count', protect, getUnreadCount);

// Mark a notification as read
router.patch('/:id/read', protect, markAsRead);

// Delete a notification
router.delete('/:id', protect, deleteNotification);

export default router; 