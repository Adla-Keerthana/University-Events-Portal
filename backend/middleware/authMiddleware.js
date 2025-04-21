import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Check for token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
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

    // Check if user is admin or a committee member of this event
    const isCommitteeMember = event.committeeMembers.some(
        member => member.user.toString() === req.user._id.toString()
    );

    if (req.user && (req.user.role === 'admin' || isCommitteeMember)) {
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