import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
    const { category, status, startDate, endDate } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }

    const events = await Event.find(query)
        .populate('organizer', 'name email')
        .populate('committeeMembers.user', 'name email')
        .sort({ startDate: 1 });
    res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('committeeMembers.user', 'name email')
        .populate('participants.user', 'name email')
        .populate('waitlist.user', 'name email');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.json(event);
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Committee Member
export const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        maxParticipants,
        registrationFee,
        rules,
        committeeMembers
    } = req.body;

    // Check for venue conflicts
    const event = new Event({
        title,
        description,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        maxParticipants,
        registrationFee,
        rules,
        committeeMembers,
        organizer: req.user._id
    });

    const conflict = await event.hasConflict();
    if (conflict) {
        res.status(400);
        throw new Error('Venue is already booked for the specified time period');
    }

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Event Organizer
export const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check for venue conflicts if venue is being updated
    if (req.body.venue && req.body.venue.name !== event.venue.name) {
        const tempEvent = new Event({
            ...event.toObject(),
            venue: req.body.venue,
            startDate: req.body.startDate || event.startDate,
            endDate: req.body.endDate || event.endDate
        });
        const conflict = await tempEvent.hasConflict();
        if (conflict) {
            res.status(400);
            throw new Error('Venue is already booked for the specified time period');
        }
    }

    // Update event fields
    Object.keys(req.body).forEach(key => {
        if (key !== 'participants' && key !== 'waitlist') {
            event[key] = req.body[key];
        }
    });

    const updatedEvent = await event.save();
    res.json(updatedEvent);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Event Organizer
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    await event.remove();
    res.json({ message: 'Event removed' });
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.participants.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    if (event.currentParticipants >= event.maxParticipants) {
        res.status(400);
        throw new Error('Event is full');
    }

    event.participants.push(req.user._id);
    event.currentParticipants += 1;
    await event.save();

    // Create notification for event organizer
    await Notification.create({
        recipient: event.organizer,
        event: event._id,
        type: 'registration_confirmed',
        message: `${req.user.name} has registered for "${event.title}"`
    });

    res.json({ message: 'Successfully registered for event' });
});

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterFromEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (!event.participants.includes(req.user._id)) {
        res.status(400);
        throw new Error('Not registered for this event');
    }

    event.participants = event.participants.filter(
        id => id.toString() !== req.user._id.toString()
    );
    event.currentParticipants -= 1;
    await event.save();

    // Create notification for event organizer
    await Notification.create({
        recipient: event.organizer,
        event: event._id,
        type: 'registration_cancelled',
        message: `${req.user.name} has cancelled their registration for "${event.title}"`
    });

    res.json({ message: 'Successfully unregistered from event' });
});

// @desc    Add committee member to event
// @route   POST /api/events/:id/committee
// @access  Private/Event Organizer
export const addCommitteeMember = asyncHandler(async (req, res) => {
    const { userId, role, permissions } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if user is already a committee member
    const isAlreadyMember = event.committeeMembers.some(
        member => member.user.toString() === userId
    );

    if (isAlreadyMember) {
        res.status(400);
        throw new Error('User is already a committee member');
    }

    event.committeeMembers.push({
        user: userId,
        role,
        permissions
    });

    const updatedEvent = await event.save();
    res.json(updatedEvent);
});

// @desc    Remove committee member from event
// @route   DELETE /api/events/:id/committee/:memberId
// @access  Private/Event Organizer
export const removeCommitteeMember = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    event.committeeMembers = event.committeeMembers.filter(
        member => member.user.toString() !== req.params.memberId
    );

    const updatedEvent = await event.save();
    res.json(updatedEvent);
}); 