import express from 'express';
import {
    createSponsor,
    updateSponsor,
    getSponsorAnalytics,
    updateAdvertisementMetrics,
    addSponsorFeedback,
    getSponsorshipTiers
} from '../controllers/sponsorshipController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sponsor management routes
router.post('/', protect, admin, createSponsor);
router.put('/:id', protect, admin, updateSponsor);

// Analytics routes
router.get('/:id/analytics', protect, admin, getSponsorAnalytics);
router.put('/:id/analytics/:eventId', protect, admin, updateAdvertisementMetrics);
router.post('/:id/feedback', protect, addSponsorFeedback);

// Public routes
router.get('/tiers', getSponsorshipTiers);

export default router; 