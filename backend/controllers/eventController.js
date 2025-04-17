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
    try {
        console.log('Request body:', req.body);
        console.log('Authenticated user:', req.user);

        // Check if user is authenticated
        if (!req.user?._id) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }

        // Parse JSON strings from FormData with error handling
        let venue;
        let registrationFee;

        try {
            venue = typeof req.body.venue === 'string' ? JSON.parse(req.body.venue) : req.body.venue;
            registrationFee = typeof req.body.registrationFee === 'string' ? JSON.parse(req.body.registrationFee) : req.body.registrationFee;
        } catch (error) {
            console.error('JSON parsing error:', error);
            res.status(400);
            throw new Error('Invalid JSON data in venue or registration fee');
        }

        console.log('Parsed venue:', venue);
        console.log('Parsed registrationFee:', registrationFee);

        // Validate required fields
        const requiredFields = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            'venue.name': venue?.name,
            'venue.location': venue?.location,
            'venue.capacity': venue?.capacity,
            maxParticipants: req.body.maxParticipants,
            'registrationFee.amount': registrationFee?.amount
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value && value !== 0)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            res.status(400);
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Parse dates
        const parsedStartDate = new Date(req.body.startDate);
        const parsedEndDate = new Date(req.body.endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            res.status(400);
            throw new Error('Invalid date format');
        }

        // Create event object
        const event = new Event({
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            category: req.body.category,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            venue: {
                name: venue.name.trim(),
                location: venue.location.trim(),
                capacity: parseInt(venue.capacity)
            },
            maxParticipants: parseInt(req.body.maxParticipants),
            registrationFee: {
                amount: parseFloat(registrationFee.amount),
                currency: 'INR'
            },
            organizer: req.user._id,
            status: 'upcoming'
        });

        // Validate numeric fields
        if (isNaN(event.venue.capacity) || event.venue.capacity <= 0) {
            res.status(400);
            throw new Error('Venue capacity must be a positive number');
        }

        if (isNaN(event.maxParticipants) || event.maxParticipants <= 0) {
            res.status(400);
            throw new Error('Maximum participants must be a positive number');
        }

        if (isNaN(event.registrationFee.amount) || event.registrationFee.amount < 0) {
            res.status(400);
            throw new Error('Registration fee must be a non-negative number');
        }

        // Check for venue conflicts
        const conflict = await event.hasConflict();
        if (conflict) {
            res.status(400);
            throw new Error('Venue is already booked for the specified time period');
        }

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
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