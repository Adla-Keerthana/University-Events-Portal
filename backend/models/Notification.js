import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a recipient for the notification']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide an event for the notification']
  },
  type: {
    type: String,
    required: [true, 'Please provide a notification type'],
    enum: ['event_created', 'event_updated', 'event_cancelled', 'registration_confirmed', 'registration_cancelled', 'sponsorship_approved', 'sponsorship_rejected']
  },
  message: {
    type: String,
    required: [true, 'Please provide a notification message']
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 