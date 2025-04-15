import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../store/slices/eventSlice';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import './CreateEvent.css';

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.events);
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
      capacity: '',
      facilities: []
    },
    maxParticipants: '',
    registrationFee: {
      amount: '',
      currency: 'INR',
      paymentDeadline: ''
    },
    rules: ['']
  });

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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createEvent(formData));
      if (!result.error) {
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const categories = [
    'Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket', 
    'Badminton', 'Table Tennis', 'Hackathons', 'Technical', 
    'Cultural', 'Academic'
  ];

  if (!user || user.role !== 'committee_member') {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>You must be a committee member to create events.</p>
        <button onClick={() => navigate('/events')} className="back-button">
          <ArrowLeftIcon className="back-icon" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <h2>Create New Event</h2>
        <button onClick={() => navigate('/events')} className="back-button">
          <ArrowLeftIcon className="back-icon" />
          Back to Events
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
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
              rows={4}
              placeholder="Enter event description"
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
          <h3>Date and Time</h3>
          <div className="form-grid">
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
          <h3>Venue Information</h3>
          <div className="form-group">
            <label htmlFor="venue.name">Venue Name</label>
            <input
              type="text"
              id="venue.name"
              name="venue.name"
              value={formData.venue.name}
              onChange={handleChange}
              required
              placeholder="Enter venue name"
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
              placeholder="Enter venue location"
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
              placeholder="Enter venue capacity"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Registration Details</h3>
          <div className="form-group">
            <label htmlFor="maxParticipants">Maximum Participants</label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              placeholder="Enter maximum number of participants"
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
              placeholder="Enter registration fee"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationFee.paymentDeadline">Payment Deadline</label>
            <input
              type="date"
              id="registrationFee.paymentDeadline"
              name="registrationFee.paymentDeadline"
              value={formData.registrationFee.paymentDeadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Event Rules</h3>
          {formData.rules.map((rule, index) => (
            <div key={index} className="rule-group">
              <input
                type="text"
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                placeholder="Enter event rule"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="remove-rule-button"
                >
                  <TrashIcon className="remove-icon" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRule}
            className="add-rule-button"
          >
            <PlusIcon className="add-icon" />
            Add Rule
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent; 