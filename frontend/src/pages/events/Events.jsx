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
} from '@heroicons/react/24/outline';
import './Events.css';

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sort: '-createdAt',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showEventList, setShowEventList] = useState(false);

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

  const handleSearch = () => {
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
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        {isAuthenticated && (
          <Link to="/events/create" className="create-event-button">
            <PlusIcon className="button-icon" />
            Create Event
          </Link>
        )}
      </div>

      <div className="events-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <MagnifyingGlassIcon className="search-icon" />
          </button>
        </div>

        <div className="filter-options">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
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
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setShowEventList(!showEventList)}
            className="view-toggle-button"
          >
            <ListBulletIcon className="toggle-icon" />
            {showEventList ? 'Grid View' : 'List View'}
          </button>
        </div>
      </div>

      {showEventList ? (
        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className="event-list-item">
              <div className="event-list-content">
                <h3 className="event-list-title">{event.title}</h3>
                <div className="event-list-details">
                  <span className="event-list-category">{event.category}</span>
                  <span className="event-list-date">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  <span className="event-list-venue">{event.venue.name}</span>
                </div>
              </div>
              <div className="event-list-actions">
                <Link to={`/events/${event._id}`} className="event-list-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <span className="event-category">{event.category}</span>
                {isAuthenticated && (user?.role === 'admin' || user?._id === event.organizer) && (
                  <div className="event-actions">
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="action-button delete"
                    >
                      <TrashIcon className="action-icon" />
                    </button>
                    <Link
                      to={`/events/${event._id}/edit`}
                      className="action-button edit"
                    >
                      <PencilIcon className="action-icon" />
                    </Link>
                  </div>
                )}
              </div>
              <div className="event-card-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="detail-item">
                    <CalendarIcon className="detail-icon" />
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <MapPinIcon className="detail-icon" />
                    <span>{event.venue.name}</span>
                  </div>
                  <div className="detail-item">
                    <UserGroupIcon className="detail-icon" />
                    <span>{event.participants?.length || 0}/{event.maxParticipants}</span>
                  </div>
                </div>
              </div>
              <div className="event-card-footer">
                <Link to={`/events/${event._id}`} className="view-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events; 