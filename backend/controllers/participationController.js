import Event from '../models/Event.js';
import Result from '../models/Result.js';
import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if user is already registered
    const isRegistered = event.participants.some(
        p => p.user.toString() === req.user._id.toString()
    );

    if (isRegistered) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
        // Add to waitlist
        const waitlistPosition = event.waitlist.length + 1;
        event.waitlist.push({
            user: req.user._id,
            position: waitlistPosition,
            addedAt: new Date()
        });

        await event.save();

        // Create notification
        await Notification.create({
            recipient: req.user._id,
            event: event._id,
            type: 'waitlist_added',
            message: `You have been added to the waitlist for ${event.title} (Position: ${waitlistPosition})`
        });

        res.json({
            message: 'Added to waitlist',
            position: waitlistPosition
        });
    } else {
        // Register for event
        event.participants.push({
            user: req.user._id,
            registeredAt: new Date(),
            paymentStatus: 'pending'
        });
        event.currentParticipants += 1;

        await event.save();

        // Create notification
        await Notification.create({
            recipient: req.user._id,
            event: event._id,
            type: 'registration_confirmed',
            message: `Your registration for ${event.title} has been confirmed`
        });

        res.json({
            message: 'Successfully registered for event',
            paymentStatus: 'pending'
        });
    }
});

// @desc    Mark attendance for an event
// @route   PUT /api/events/:id/attendance/:userId
// @access  Private/Event Organizer
export const markAttendance = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const participant = event.participants.find(
        p => p.user.toString() === req.params.userId
    );

    if (!participant) {
        res.status(404);
        throw new Error('Participant not found');
    }

    participant.attendance = true;
    await event.save();

    // Create notification
    await Notification.create({
        recipient: req.params.userId,
        event: event._id,
        type: 'attendance_marked',
        message: `Your attendance has been marked for ${event.title}`
    });

    res.json({ message: 'Attendance marked successfully' });
});

// @desc    Add event result
// @route   POST /api/events/:id/results
// @access  Private/Event Organizer
export const addResult = asyncHandler(async (req, res) => {
    const { participantId, position, score, category, prize, remarks } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Calculate points based on position and category
    const pointsEarned = calculatePoints(position, category);

    const result = await Result.create({
        event: event._id,
        participant: participantId,
        position,
        score,
        category,
        pointsEarned,
        prize,
        remarks
    });

    // Create notification
    await Notification.create({
        recipient: participantId,
        event: event._id,
        type: 'result_declared',
        message: `Results for ${event.title} have been declared. You secured ${position} position!`
    });

    res.status(201).json(result);
});

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = asyncHandler(async (req, res) => {
    const { category, timeFrame } = req.query;
    const query = {};

    if (category) {
        query['event.category'] = category;
    }

    if (timeFrame) {
        const now = new Date();
        let startDate;
        switch (timeFrame) {
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0);
        }
        query.createdAt = { $gte: startDate };
    }

    const leaderboard = await Result.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$participant',
                totalPoints: { $sum: '$pointsEarned' },
                eventsParticipated: { $sum: 1 },
                wins: {
                    $sum: {
                        $cond: [{ $eq: ['$category', 'winner'] }, 1, 0]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                name: '$user.name',
                department: '$user.department',
                totalPoints: 1,
                eventsParticipated: 1,
                wins: 1
            }
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 100 }
    ]);

    res.json(leaderboard);
});

// Helper function to calculate points
const calculatePoints = (position, category) => {
    let basePoints = 0;
    switch (category) {
        case 'winner':
            basePoints = 100;
            break;
        case 'runner_up':
            basePoints = 75;
            break;
        case 'participant':
            basePoints = 25;
            break;
    }
    return basePoints - (position - 1) * 5;
}; 