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
  date: {
    type: Date,
    required: [true, 'Please provide a date']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['academic', 'sports', 'cultural', 'technical', 'workshop', 'other']
  },
  registrationFee: {
    type: Number,
    required: [true, 'Please provide registration fee'],
    default: 0
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum participants']
  },
  points: {
    type: Number,
    required: [true, 'Please provide points'],
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please provide an image']
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

// Update status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);

  if (now > eventDate) {
    this.status = 'completed';
  } else if (now.toDateString() === eventDate.toDateString()) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }

  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event; 