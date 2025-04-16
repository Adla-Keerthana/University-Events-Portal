import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../store/slices/eventSlice';
import { toast } from 'react-toastify';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  MusicalNoteIcon,
  WrenchIcon,
  LightBulbIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const EventCard = ({ event, onDelete, isAdmin }) => {
  const status = getEventStatus(event.startDate, event.endDate);
  const statusColors = {
    Upcoming: 'bg-green-100 text-green-800',
    Ongoing: 'bg-blue-100 text-blue-800',
    Completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3'}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {event.category}
            </span>
          </div>
          {isAdmin && (
            <div className="flex space-x-2">
              <Link
                to={`/events/edit/${event._id}`}
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-200"
              >
                <PencilIcon className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(event._id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-1">
          {event.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{event.venue.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            <span>{event.registrations?.length || 0} registered</span>
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sort: '-createdAt',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showEventList, setShowEventList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket',
    'Badminton', 'Table Tennis', 'Hackathons', 'Technical',
    'Cultural', 'Academic'
  ];

  useEffect(() => {
    dispatch(getEvents(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete event');
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic':
        return <AcademicCapIcon className="h-6 w-6" />;
      case 'Sports':
        return <TrophyIcon className="h-6 w-6" />;
      case 'Cultural':
        return <MusicalNoteIcon className="h-6 w-6" />;
      case 'Technical':
        return <WrenchIcon className="h-6 w-6" />;
      case 'Workshop':
        return <LightBulbIcon className="h-6 w-6" />;
      default:
        return <CalendarIcon className="h-6 w-6" />;
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Ongoing';
    return 'Completed';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Create Event Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {isAuthenticated && (
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <form onSubmit={handleSearch} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
                <ChevronDownIcon className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Options */}
            <div className={`mt-4 space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Events Grid/List */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            {isAuthenticated && (
              <div className="mt-6">
                <Link
                  to="/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Event
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDeleteEvent}
                isAdmin={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;