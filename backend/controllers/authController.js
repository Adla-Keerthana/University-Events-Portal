import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailUtils.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'student', department = '', year = '1st', studentId = '', interests = [] } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            year,
            studentId,
            interests
        });

        // Generate token
        const token = generateToken(user._id);

        // Send verification email
        const verificationToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        
        await sendEmail({
            to: email,
            subject: 'Verify Your University Email',
            html: `
                <h1>Welcome to University Events!</h1>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                year: user.year,
                studentId: user.studentId,
                interests: user.interests
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(401).json({ message: 'Account is not active' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                year: user.year,
                studentId: user.studentId,
                interests: user.interests,
                totalPoints: user.totalPoints,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('participationHistory.event', 'title category startDate endDate');
    
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            year: user.year,
            studentId: user.studentId,
            interests: user.interests,
            role: user.role,
            committeePermissions: user.committeePermissions,
            isEmailVerified: user.isEmailVerified,
            totalPoints: user.totalPoints,
            achievements: user.achievements,
            participationHistory: user.participationHistory,
            avatar: user.avatar,
            status: user.status
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (user) {
        user.name = req.body.name || user.name;
        user.department = req.body.department || user.department;
        user.year = req.body.year || user.year;
        user.interests = req.body.interests || user.interests;
        user.avatar = req.body.avatar || user.avatar;

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
            interests: updatedUser.interests,
            role: updatedUser.role,
            totalPoints: updatedUser.totalPoints,
            avatar: updatedUser.avatar
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.isEmailVerified = true;
        await user.save();
        
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(401);
        throw new Error('Invalid or expired token');
    }
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const token = generateToken(user._id);
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
    });

    res.json({ message: 'Password reset email sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired token');
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(401);
        throw new Error('Invalid or expired token');
    }
});

// @desc    Manage committee members
// @route   PUT /api/auth/committee/:id
// @access  Private/Admin
export const manageCommittee = asyncHandler(async (req, res) => {
    const { permissions, action } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if requester has permission to manage committee
    if (!req.user.canManageCommittee()) {
        res.status(403);
        throw new Error('Not authorized to manage committee members');
    }

    if (action === 'add') {
        user.role = 'committee_member';
        user.committeePermissions = [...new Set([...user.committeePermissions, ...permissions])];
    } else if (action === 'remove') {
        user.committeePermissions = user.committeePermissions.filter(
            permission => !permissions.includes(permission)
        );
        if (user.committeePermissions.length === 0) {
            user.role = 'student';
        }
    }

    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        committeePermissions: updatedUser.committeePermissions
    });
});

// @desc    Update user status
// @route   PUT /api/auth/status/:id
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update user status');
    }

    user.status = status;
    const updatedUser = await user.save();
    
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status
    });
}); 