import User from '../models/User.js';
import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Only allow users to update their own profile unless admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this user');
    }

    user.name = req.body.name || user.name;
    user.department = req.body.department || user.department;
    user.year = req.body.year || user.year;

    if (req.body.password) {
        user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        department: updatedUser.department,
        year: updatedUser.year,
        role: updatedUser.role
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.remove();
    res.json({ message: 'User removed' });
});

// @desc    Get user's events
// @route   GET /api/users/:id/events
// @access  Private
export const getUserEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({
        $or: [
            { organizer: req.params.id },
            { participants: req.params.id }
        ]
    }).populate('organizer', 'name email');

    res.json(events);
}); 