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
  ArrowLeftIcon,
  TagIcon,
  ClockIcon,
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

  const [imagePreview, setImagePreview] = useState(null);

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
      if (files[0]) {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
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

      // Validate start date is before end date
      if (startDateTime >= endDateTime) {
        throw new Error('End date and time must be after start date and time');
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

      if (maxParticipants > venueData.capacity) {
        throw new Error('Maximum participants cannot exceed venue capacity');
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/events')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to events"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Form header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Event Details</h2>
            <p className="text-primary-100 text-sm mt-1">Fill in the information below to create your event</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Main form content */}
            <div className="space-y-8">
              {/* Basic Information Section */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        placeholder="Enter a descriptive title for your event"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee (INR) <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="registrationFee.amount"
                        value={formData.registrationFee.amount}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter amount (0 for free events)"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        placeholder="Provide a detailed description of your event"
                      />
                      <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Include important details about what attendees can expect</p>
                  </div>
                </div>
              </section>

              {/* Date and Time Section */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">Date & Time</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Location Section */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">Location & Capacity</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="venue.name"
                        value={formData.venue.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        placeholder="Name of the venue"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Location <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="venue.location"
                        value={formData.venue.location}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        placeholder="Address of the venue"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Capacity <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="venue.capacity"
                        value={formData.venue.capacity}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        min="1"
                        placeholder="Maximum capacity of venue"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                        required
                        min="1"
                        placeholder="Number of allowed participants"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Cannot exceed venue capacity</p>
                  </div>
                </div>
              </section>

              {/* Image Upload Section */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">Event Image</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image <span className="text-red-500">*</span></label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              className="sr-only"
                              onChange={handleChange}
                              accept="image/*"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="block text-sm font-medium text-gray-700 mb-1">Preview</p>
                        <div className="h-40 w-full overflow-hidden rounded-md">
                          <img 
                            src={imagePreview} 
                            alt="Event preview" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Form Actions */}
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;