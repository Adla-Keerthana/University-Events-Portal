import express from 'express';
import {
    registerForEvent,
    markAttendance,
    addResult,
    getLeaderboard
} from '../controllers/participationController.js';
import { protect, eventOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Participation routes
router.post('/events/:id/register', protect, registerForEvent);
router.put('/events/:id/attendance/:userId', protect, eventOrganizer, markAttendance);

// Results and leaderboard routes
router.post('/events/:id/results', protect, eventOrganizer, addResult);
router.get('/leaderboard', getLeaderboard);

export default router; 