import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
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
            required: [true, 'Please provide venue capacity']
        }
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Please provide maximum participants']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Other']
    },
    image: {
        data: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    },
    registrationFee: {
        amount: {
            type: Number,
            required: [true, 'Please provide registration fee amount']
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    }
}, {
    timestamps: true
});

// Update status based on dates
eventSchema.pre('save', function(next) {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (now > end) {
        this.status = 'completed';
    } else if (now >= start && now <= end) {
        this.status = 'ongoing';
    } else {
        this.status = 'upcoming';
    }

    next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event; 