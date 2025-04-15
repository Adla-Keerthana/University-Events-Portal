import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventById,
  registerForEvent,
  cancelRegistration,
  updateEventResults,
} from '../../store/slices/eventSlice';
import { format } from 'date-fns';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  TrophyIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent: event, loading, error } = useSelector((state) => state.events);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [results, setResults] = useState('');

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(registerForEvent(id));
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await dispatch(cancelRegistration(id));
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  const handleUpdateResults = async () => {
    try {
      await dispatch(updateEventResults({ eventId: id, results }));
      setResults('');
    } catch (error) {
      console.error('Error updating results:', error);
    }
  };

  const isRegistered = event?.participants?.some(
    (participant) => participant.user._id === user?._id
  );

  const isOrganizer = event?.organizer?._id === user?._id;

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

  if (!event) {
    return (
      <div className="not-found">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <ArrowLeftIcon className="back-icon" />
        Back to Events
      </button>

      <div className="event-header">
        <h1 className="event-title">{event.title}</h1>
        <span className={`event-status status-${event.status.toLowerCase()}`}>
          {event.status}
        </span>
      </div>

      <div className="event-content">
        <div className="event-info">
          <div className="info-section">
            <h2 className="section-title">Event Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <CalendarIcon className="info-icon" />
                <div>
                  <p className="info-label">Date</p>
                  <p className="info-value">
                    {format(new Date(event.startDate), 'MMMM d, yyyy')} -{' '}
                    {format(new Date(event.endDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="info-item">
                <ClockIcon className="info-icon" />
                <div>
                  <p className="info-label">Time</p>
                  <p className="info-value">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
              <div className="info-item">
                <MapPinIcon className="info-icon" />
                <div>
                  <p className="info-label">Venue</p>
                  <p className="info-value">{event.venue.name}</p>
                  <p className="info-subvalue">{event.venue.location}</p>
                </div>
              </div>
              <div className="info-item">
                <UserGroupIcon className="info-icon" />
                <div>
                  <p className="info-label">Participants</p>
                  <p className="info-value">
                    {event.currentParticipants}/{event.maxParticipants}
                  </p>
                </div>
              </div>
              <div className="info-item">
                <CurrencyDollarIcon className="info-icon" />
                <div>
                  <p className="info-label">Registration Fee</p>
                  <p className="info-value">
                    ₹{event.registrationFee.amount}
                  </p>
                  {event.registrationFee.paymentDeadline && (
                    <p className="info-subvalue">
                      Payment Deadline: {format(new Date(event.registrationFee.paymentDeadline), 'PPPp')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2 className="section-title">Description</h2>
            <p className="description-text">{event.description}</p>
          </div>

          {event.rules && event.rules.length > 0 && (
            <div className="rules-section">
              <h2 className="section-title">Rules</h2>
              <ul className="rules-list">
                {event.rules.map((rule, index) => (
                  <li key={index} className="rule-item">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="event-actions">
          {isAuthenticated ? (
            isRegistered ? (
              <button
                onClick={handleCancelRegistration}
                className="action-button cancel-button"
              >
                Cancel Registration
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="action-button register-button"
              >
                Register Now
              </button>
            )
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="action-button login-button"
            >
              Login to Register
            </button>
          )}

          {isOrganizer && (
            <div className="organizer-actions">
              <h3 className="section-title">Organizer Actions</h3>
              <div className="results-section">
                <textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Enter event results..."
                  className="results-input"
                />
                <button
                  onClick={handleUpdateResults}
                  className="action-button update-button"
                >
                  Update Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 