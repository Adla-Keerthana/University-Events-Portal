import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../store/slices/eventSlice';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.events);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
    category: '',
    image: null,
    registrationFee: {
      amount: ''
    },
    organizer: user?._id || ''
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!user || !token) {
      toast.error('Please login to create an event');
      navigate('/login');
    }
  }, [user, token, navigate]);

  const categories = [
    'Academic',
    'Sports',
    'Cultural',
    'Technical',
    'Workshop',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name.includes('.')) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check authentication first
      if (!token) {
        throw new Error('You must be logged in to create an event');
      }

      // Validate user authentication
      if (!user?._id) {
        throw new Error('You must be logged in to create an event');
      }

      const formDataToSend = new FormData();

      // Basic validation
      if (!formData.title || !formData.description || !formData.category ||
          !formData.startDate || !formData.endDate || !formData.startTime ||
          !formData.endTime || !formData.venue.name || !formData.venue.location ||
          !formData.venue.capacity || !formData.maxParticipants ||
          !formData.registrationFee.amount) {
        throw new Error('Please fill in all required fields');
      }

      // Add all form fields to FormData
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('organizer', user._id);

      // Format dates properly
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date or time format');
      }

      formDataToSend.append('startDate', startDateTime.toISOString());
      formDataToSend.append('endDate', endDateTime.toISOString());
      formDataToSend.append('startTime', formData.startTime);
      formDataToSend.append('endTime', formData.endTime);

      // Validate and format venue data
      const venueData = {
        name: formData.venue.name.trim(),
        location: formData.venue.location.trim(),
        capacity: parseInt(formData.venue.capacity)
      };

      if (isNaN(venueData.capacity) || venueData.capacity <= 0) {
        throw new Error('Venue capacity must be a positive number');
      }

      formDataToSend.append('venue', JSON.stringify(venueData));

      // Validate and format maxParticipants
      const maxParticipants = parseInt(formData.maxParticipants);
      if (isNaN(maxParticipants) || maxParticipants <= 0) {
        throw new Error('Maximum participants must be a positive number');
      }
      formDataToSend.append('maxParticipants', maxParticipants);

      // Validate and format registration fee
      const registrationFeeData = {
        amount: parseFloat(formData.registrationFee.amount),
        currency: 'INR'
      };

      if (isNaN(registrationFeeData.amount) || registrationFeeData.amount < 0) {
        throw new Error('Registration fee must be a non-negative number');
      }

      formDataToSend.append('registrationFee', JSON.stringify(registrationFeeData));

      // Add image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Log the form data being sent
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: venueData,
        maxParticipants,
        registrationFee: registrationFeeData,
        organizer: user._id
      });

      const result = await dispatch(createEvent(formDataToSend)).unwrap();

      if (result) {
        toast.success('Event created successfully!');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="venue.name"
                    value={formData.venue.name}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                    placeholder="Enter venue name"
                  />
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Location</label>
                <div className="relative">
                  <input
                    type="text"
                    name="venue.location"
                    value={formData.venue.location}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                    placeholder="Enter venue location"
                  />
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Capacity</label>
                <div className="relative">
                  <input
                    type="number"
                    name="venue.capacity"
                    value={formData.venue.capacity}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                    min="1"
                    placeholder="Enter venue capacity"
                  />
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Participants</label>
                <div className="relative">
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                    min="1"
                    placeholder="Enter maximum participants"
                  />
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Registration Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    name="registrationFee.amount"
                    value={formData.registrationFee.amount}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter registration fee"
                  />
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input pl-10 h-32"
                  required
                  placeholder="Enter event description"
                />
                <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Image</label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="form-input pl-10"
                  accept="image/*"
                  required
                />
                <PhotoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;