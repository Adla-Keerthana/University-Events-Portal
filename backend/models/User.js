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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['student', 'committee_member', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
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
      date: Date
    }],
    committeePermissions: [{
      type: String,
      enum: ['create_events', 'edit_events', 'delete_events', 'manage_participants', 'manage_venues']
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

const User = mongoose.model('User', userSchema);

export default User; 