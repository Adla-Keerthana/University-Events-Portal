import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all notifications for the authenticated user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate('event', 'title');

    res.json(notifications);
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        recipient: req.user._id,
        read: false
    });

    res.json({ count });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.remove();
    res.json({ message: 'Notification removed' });
}); 