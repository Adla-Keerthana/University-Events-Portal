import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sponsors', sponsorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/university-events';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 