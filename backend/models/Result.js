import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['winner', 'runner_up', 'participant'],
    required: true
  },
  pointsEarned: {
    type: Number,
    required: true
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateUrl: String,
  prize: {
    type: String,
    required: function() {
      return this.category === 'winner' || this.category === 'runner_up';
    }
  },
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
resultSchema.index({ event: 1, participant: 1 });
resultSchema.index({ participant: 1, pointsEarned: -1 });

const Result = mongoose.model('Result', resultSchema);

export default Result; 