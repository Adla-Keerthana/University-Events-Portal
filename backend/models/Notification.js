import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'event_created',
      'event_updated',
      'event_cancelled',
      'registration_confirmed',
      'registration_waitlisted',
      'payment_required',
      'payment_confirmed',
      'event_reminder',
      'result_published',
      'sponsorship_request',
      'sponsorship_approved',
      'sponsorship_rejected',
      'committee_invitation',
      'committee_removal',
      'system_announcement'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 