import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the sponsor'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email for the sponsor'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number for the sponsor']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name']
  },
  sponsorshipType: {
    type: String,
    required: [true, 'Please provide a sponsorship type'],
    enum: ['Gold', 'Silver', 'Bronze', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the sponsorship amount']
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  logo: {
    type: String,
    default: 'default-sponsor.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor; 