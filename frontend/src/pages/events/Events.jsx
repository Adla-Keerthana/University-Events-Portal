import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents } from '../../store/slices/eventSlice';
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

  const categories = [
    'Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket', 
    'Badminton', 'Table Tennis', 'Hackathons', 'Technical', 
    'Cultural', 'Academic'
  ];

  const [showEventList, setShowEventList] = useState(false);

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
      // Add delete event functionality here
      console.log('Delete event:', eventId);
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

  return (
    <div className="events-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Discover Amazing University Events
        </h1>
        {!isAuthenticated && (
          <p className="hero-subtitle">
            Sign in to view and participate in exciting university events. Connect with your campus community.
          </p>
        )}
      </div>

      {isAuthenticated && (
        <>
          {/* Action Buttons */}
          <div className="action-buttons">
            {user?.role === 'committee_member' && (
              <Link to="/events/create" className="action-button create-button">
                <PlusIcon className="action-icon" />
                Create Event
              </Link>
            )}
            <button 
              onClick={() => setShowEventList(!showEventList)} 
              className="action-button list-button"
            >
              <ListBulletIcon className="action-icon" />
              {showEventList ? 'Hide List' : 'Show List'}
            </button>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="search-filter">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="search-input"
              />
              <button onClick={handleSearch} className="search-button">
                <MagnifyingGlassIcon className="search-icon" />
                Search
              </button>
            </div>
            <div className="filter-group">
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
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="leaderboard-section">
            <h2 className="section-title">Top Participants</h2>
            <div className="leaderboard-list">
              {/* Add leaderboard items here */}
            </div>
          </div>

          {/* Events Display */}
          {loading ? (
            <div className="loading-spinner">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <>
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
                      <div className="event-content">
                        <div className="event-header">
                          <h3 className="event-title">{event.title}</h3>
                          <span className="event-category">
                            {getCategoryIcon(event.category)}
                            {event.category}
                          </span>
                        </div>
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                          <div className="event-detail">
                            <CalendarIcon className="detail-icon" />
                            {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                          </div>
                          <div className="event-detail">
                            <MapPinIcon className="detail-icon" />
                            {event.venue.name}
                          </div>
                          <div className="event-detail">
                            <UserGroupIcon className="detail-icon" />
                            {event.currentParticipants}/{event.maxParticipants} Participants
                          </div>
                        </div>
                        <div className="event-footer">
                          <span className={`event-status status-${getEventStatus(event.startDate, event.endDate).toLowerCase()}`}>
                            {getEventStatus(event.startDate, event.endDate)}
                          </span>
                          <div className="event-actions">
                            <Link to={`/events/${event._id}`} className="event-button">
                              View Details
                            </Link>
                            {user?.role === 'committee_member' && (
                              <div className="admin-actions">
                                <button
                                  onClick={() => handleDeleteEvent(event._id)}
                                  className="delete-button"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                                <Link
                                  to={`/events/edit/${event._id}`}
                                  className="edit-button"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Events; 