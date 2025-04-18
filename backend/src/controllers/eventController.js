import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        maxParticipants,
        category,
        registrationFee,
        image
    } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !startDate || !endDate || !startTime || !endTime || 
        !venue?.name || !venue?.location || !venue?.capacity || !maxParticipants || 
        !category || !registrationFee?.amount || !image?.data || !image?.contentType) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Create event
    const event = await Event.create({
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        maxParticipants,
        category,
        image,
        registrationFee,
        organizer: req.user._id
    });

    if (event) {
        res.status(201).json({
            _id: event._id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            venue: event.venue,
            maxParticipants: event.maxParticipants,
            category: event.category,
            image: event.image,
            registrationFee: event.registrationFee,
            organizer: event.organizer,
            status: event.status
        });
    } else {
        res.status(400);
        throw new Error('Invalid event data');
    }
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
    const { category, status, search, sort = '-createdAt' } = req.query;
    
    const query = {};
    
    if (category) {
        query.category = category;
    }
    
    if (status) {
        query.status = status;
    }
    
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const events = await Event.find(query)
        .sort(sort)
        .populate('organizer', 'name email')
        .populate('participants', 'name email');

    res.json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('participants', 'name email');

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
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

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this event');
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('organizer', 'name email')
     .populate('participants', 'name email');

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

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this event');
    }

    await event.remove();
    res.json({ message: 'Event removed' });
}); 