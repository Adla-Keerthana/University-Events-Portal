import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../store/slices/eventSlice';
import { toast } from 'react-toastify';
import './CreateEvent.css';

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: {
      name: '',
      location: '',
      capacity: ''
    },
    maxParticipants: '',
    registrationFee: {
      amount: '',
      currency: 'INR',
      paymentDeadline: ''
    },
    rules: [],
    committeeMembers: [],
    status: 'upcoming',
    image: 'default-event.jpg'
  });

  const categories = [
    'Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket', 
    'Badminton', 'Table Tennis', 'Hackathons', 'Technical', 
    'Cultural', 'Academic'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'rules') {
      setFormData(prev => ({
        ...prev,
        rules: value.split('\n').map(rule => ({
          title: 'Rule',
          description: rule.trim()
        })).filter(rule => rule.description)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationFee: {
          ...formData.registrationFee,
          amount: Number(formData.registrationFee.amount),
          paymentDeadline: formData.registrationFee.paymentDeadline 
            ? new Date(formData.registrationFee.paymentDeadline).toISOString()
            : undefined
        },
        venue: {
          ...formData.venue,
          capacity: Number(formData.venue.capacity)
        },
        maxParticipants: Number(formData.maxParticipants),
        organizer: user._id
      };

      await dispatch(createEvent(eventData)).unwrap();
      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <div className="create-event-container">
      <h1 className="create-event-title">Create New Event</h1>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Date and Time</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Venue Information</h2>
          <div className="form-group">
            <label htmlFor="venue.name">Venue Name</label>
            <input
              type="text"
              id="venue.name"
              name="venue.name"
              value={formData.venue.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="venue.location">Venue Location</label>
            <input
              type="text"
              id="venue.location"
              name="venue.location"
              value={formData.venue.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="venue.capacity">Venue Capacity</label>
            <input
              type="number"
              id="venue.capacity"
              name="venue.capacity"
              value={formData.venue.capacity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Registration Details</h2>
          <div className="form-group">
            <label htmlFor="maxParticipants">Maximum Participants</label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="registrationFee.amount">Registration Fee (INR)</label>
            <input
              type="number"
              id="registrationFee.amount"
              name="registrationFee.amount"
              value={formData.registrationFee.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="registrationFee.paymentDeadline">Payment Deadline</label>
            <input
              type="datetime-local"
              id="registrationFee.paymentDeadline"
              name="registrationFee.paymentDeadline"
              value={formData.registrationFee.paymentDeadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Rules</h2>
          <div className="form-group">
            <label htmlFor="rules">Event Rules (One rule per line)</label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules.map(rule => rule.description).join('\n')}
              onChange={handleChange}
              rows="5"
              placeholder="Enter event rules, one per line"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent; 