import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'committee_member', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      trim: true,
      default: ''
    },
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', 'Masters', 'PhD'],
      default: '1st'
    },
    studentId: {
      type: String,
      trim: true,
      sparse: true,
      default: ''
    },
    interests: [{
      type: String,
      enum: ['Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket', 'Badminton', 'Table Tennis', 'Hackathons', 'Technical', 'Cultural', 'Academic']
    }],
    participationHistory: [{
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      },
      role: {
        type: String,
        enum: ['participant', 'organizer', 'committee_member']
      },
      status: {
        type: String,
        enum: ['registered', 'attended', 'won', 'runner_up']
      },
      date: Date,
      pointsEarned: {
        type: Number,
        default: 0
      }
    }],
    committeePermissions: [{
      type: String,
      enum: ['create_events', 'edit_events', 'delete_events', 'manage_participants', 'manage_venues', 'manage_committee']
    }],
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    achievements: [{
      title: String,
      description: String,
      date: Date,
      points: Number
    }],
    lastLogin: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user has specific committee permission
userSchema.methods.hasPermission = function (permission) {
  return this.role === 'admin' || (this.role === 'committee_member' && this.committeePermissions.includes(permission));
};

// Method to check if user can manage committee members
userSchema.methods.canManageCommittee = function () {
  return this.role === 'admin' || (this.role === 'committee_member' && this.committeePermissions.includes('manage_committee'));
};

// Method to update participation history
userSchema.methods.addParticipation = async function (eventId, role, status, points) {
  this.participationHistory.push({
    event: eventId,
    role,
    status,
    date: new Date(),
    pointsEarned: points
  });
  this.totalPoints += points;
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 