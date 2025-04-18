const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);

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
            registrationFee
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !startDate || !endDate || 
            !startTime || !endTime || !venue || !maxParticipants || !registrationFee) {
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                missing: {
                    title: !title,
                    description: !description,
                    category: !category,
                    startDate: !startDate,
                    endDate: !endDate,
                    startTime: !startTime,
                    endTime: !endTime,
                    venue: !venue,
                    maxParticipants: !maxParticipants,
                    registrationFee: !registrationFee
                }
            });
        }

        // Parse venue and registrationFee from string to object
        let venueData;
        let registrationFeeData;
        
        try {
            venueData = typeof venue === 'string' ? JSON.parse(venue) : venue;
            registrationFeeData = typeof registrationFee === 'string' ? JSON.parse(registrationFee) : registrationFee;
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(400).json({ message: 'Invalid venue or registration fee format' });
        }

        // Create new event
        const event = new Event({
            title,
            description,
            category,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            startTime,
            endTime,
            venue: venueData,
            maxParticipants: Number(maxParticipants),
            registrationFee: {
                amount: Number(registrationFeeData.amount),
                currency: registrationFeeData.currency || 'INR'
            },
            organizer: req.user._id
        });

        // Handle image if present
        if (req.file) {
            event.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        // Save event
        const savedEvent = await event.save();
        console.log('Event saved successfully:', savedEvent);

        // Add event to user's organized events
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { organizedEvents: savedEvent._id } }
        );

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            message: 'Error creating event', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('participants.user', 'name email');
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// @desc    Get event image
// @route   GET /api/events/:id/image
// @access  Public
exports.getEventImage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event || !event.image || !event.image.data) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', event.image.contentType);
        res.send(event.image.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image', error: error.message });
    }
}; 