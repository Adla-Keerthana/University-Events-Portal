import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getSponsors,
    getSponsorById,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    approveSponsor,
    rejectSponsor
} from '../controllers/sponsorController.js';

const router = express.Router();

router.route('/')
    .get(getSponsors)
    .post(protect, createSponsor);

router.route('/:id')
    .get(getSponsorById)
    .put(protect, admin, updateSponsor)
    .delete(protect, admin, deleteSponsor);

router.patch('/:id/approve', protect, admin, approveSponsor);
router.patch('/:id/reject', protect, admin, rejectSponsor);

export default router; 