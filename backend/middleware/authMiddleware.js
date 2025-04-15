import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

export const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});

export const committeeMember = (permission) => asyncHandler(async (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.hasPermission(permission))) {
        next();
    } else {
        res.status(401);
        throw new Error(`Not authorized. Required permission: ${permission}`);
    }
});

export const eventOrganizer = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (req.user && (
        req.user.role === 'admin' ||
        event.organizer.toString() === req.user._id.toString() ||
        event.committeeMembers.some(member => member.user.toString() === req.user._id.toString())
    )) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as event organizer or committee member');
    }
}); 