const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the event'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the event'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for the event'],
        enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Other']
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date']
    },
    startTime: {
        type: String,
        required: [true, 'Please provide a start time']
    },
    endTime: {
        type: String,
        required: [true, 'Please provide an end time']
    },
    venue: {
        name: {
            type: String,
            required: [true, 'Please provide a venue name']
        },
        location: {
            type: String,
            required: [true, 'Please provide a venue location']
        },
        capacity: {
            type: Number,
            required: [true, 'Please provide a venue capacity']
        }
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Please provide the maximum number of participants']
    },
    registrationFee: {
        amount: {
            type: Number,
            required: [true, 'Please provide a registration fee amount']
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    image: {
        data: Buffer,
        contentType: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, {
    timestamps: true
});

// Index for better query performance
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 