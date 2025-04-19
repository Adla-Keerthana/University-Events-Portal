import express from 'express';
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    addCommitteeMember,
    removeCommitteeMember
} from '../controllers/eventController.js';
import { protect, eventOrganizer } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploads.js';
const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes - any authenticated user can create events
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, eventOrganizer, updateEvent);
router.delete('/:id', protect, eventOrganizer, deleteEvent);

// Committee member management routes
router.post('/:id/committee', protect, eventOrganizer, addCommitteeMember);
router.delete('/:id/committee/:memberId', protect, eventOrganizer, removeCommitteeMember);

export default router;