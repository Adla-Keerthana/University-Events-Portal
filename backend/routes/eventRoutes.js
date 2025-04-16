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
import { protect, committeeMember, eventOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', protect, committeeMember, createEvent);
router.put('/:id', protect, eventOrganizer, updateEvent);
router.delete('/:id', protect, eventOrganizer, deleteEvent);

// Committee member management routes
router.post('/:id/committee', protect, eventOrganizer, addCommitteeMember);
router.delete('/:id/committee/:memberId', protect, eventOrganizer, removeCommitteeMember);

export default router; 