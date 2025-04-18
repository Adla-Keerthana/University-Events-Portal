const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getEventImage
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/:id/image', getEventImage);

// Protected routes
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router; 