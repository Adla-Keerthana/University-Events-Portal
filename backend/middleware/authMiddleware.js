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
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }

        if (user.status !== 'active') {
            res.status(401);
            throw new Error('Account is not active');
        }

        req.user = user;
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
        res.status(403);
        throw new Error('Not authorized as admin');
    }
});

export const committeeMember = asyncHandler(async (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'committee_member')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as committee member');
    }
});

export const eventOrganizer = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (req.user && (req.user.role === 'admin' || event.organizer.toString() === req.user._id.toString())) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as event organizer');
    }
});

export const hasPermission = (permission) => asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else if (req.user && req.user.role === 'committee_member' && req.user.committeePermissions?.includes(permission)) {
        next();
    } else {
        res.status(403);
        throw new Error(`Not authorized, missing ${permission} permission`);
    }
});

export const canManageCommittee = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.canManageCommittee()) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized to manage committee members');
    }
});

export const isEmailVerified = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isEmailVerified) {
        next();
    } else {
        res.status(403);
        throw new Error('Email not verified');
    }
}); 