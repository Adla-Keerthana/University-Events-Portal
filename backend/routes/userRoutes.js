import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserEvents
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/:id/events', protect, getUserEvents);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

export default router; 