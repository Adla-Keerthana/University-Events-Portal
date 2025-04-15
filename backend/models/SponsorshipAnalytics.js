import mongoose from 'mongoose';

const sponsorshipAnalyticsSchema = new mongoose.Schema({
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  advertisement: {
    type: {
      type: String,
      enum: ['banner', 'video', 'social_media', 'email', 'print'],
      required: true
    },
    location: String,
    duration: Number,
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    engagement: {
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    }
  },
  audienceReach: {
    total: { type: Number, default: 0 },
    demographics: {
      students: { type: Number, default: 0 },
      faculty: { type: Number, default: 0 },
      alumni: { type: Number, default: 0 }
    }
  },
  conversionMetrics: {
    leads: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    sales: { type: Number, default: 0 }
  },
  roi: {
    investment: Number,
    return: Number,
    percentage: Number
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
sponsorshipAnalyticsSchema.index({ sponsor: 1, event: 1 });
sponsorshipAnalyticsSchema.index({ 'advertisement.type': 1 });

// Update the updatedAt field before saving
sponsorshipAnalyticsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const SponsorshipAnalytics = mongoose.model('SponsorshipAnalytics', sponsorshipAnalyticsSchema);

export default SponsorshipAnalytics; 