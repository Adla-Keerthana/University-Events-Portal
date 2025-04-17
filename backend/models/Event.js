import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [false, 'Please provide a title for the event'],
    trim: false
  },
  description: {
    type: String,
    required: [false, 'Please provide a description for the event']
  },
  category: {
    type: String,
    required: [false, 'Please provide a category for the event'],
    enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Other']
  },
  startDate: {
    type: Date,
    required: [false, 'Please provide a start date for the event']
  },
  endDate: {
    type: Date,
    required: [false, 'Please provide an end date for the event']
  },
  startTime: {
    type: String,
    required: [false, 'Please provide a start time for the event']
  },
  endTime: {
    type: String,
    required: [false, 'Please provide an end time for the event']
  },
  venue: {
    name: {
      type: String,
      required: [false, 'Please provide a venue name']
    },
    location: {
      type: String,
      required: [false, 'Please provide a venue location']
    },
    capacity: {
      type: Number,
      required: [false, 'Please provide the venue capacity'],
      min: [1, 'Venue capacity must be at least 1']
    },
    facilities: [String]
  },
  maxParticipants: {
    type: Number,
    required: [false, 'Please provide the maximum number of participants'],
    min: [1, 'Maximum participants must be at least 1']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  registrationFee: {
    amount: {
      type: Number,
      required: [false, 'Please provide the registration fee amount'],
      min: [0, 'Registration fee cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentDeadline: Date
  },
  rules: [{
    title: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [false, 'Please provide an organizer for the event']
  },
  committeeMembers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    permissions: [String]
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    attendance: {
      type: Boolean,
      default: false
    }
  }],
  sponsors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor'
  }],
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better search performance
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ 'venue.name': 1 });

// Method to check if event conflicts with another event
eventSchema.methods.hasConflict = async function () {
  const Event = mongoose.model('Event');
  const conflictingEvent = await Event.findOne({
    _id: { $ne: this._id },
    'venue.name': this.venue.name,
    $or: [
      {
        startDate: { $lte: this.endDate },
        endDate: { $gte: this.startDate }
      }
    ]
  });
  return conflictingEvent;
};

const Event = mongoose.model('Event', eventSchema);

export default Event;