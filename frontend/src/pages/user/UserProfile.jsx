import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  CalendarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { updateProfile } from '../../store/slices/authSlice';
import './UserProfile.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    interests: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        year: user.year || '',
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>Please log in to view your profile</h2>
        <button onClick={() => navigate('/login')} className="login-button">
          Log In
        </button>
      </div>
    );
  }

  const interests = [
    'Chess', 'Basketball', 'Swimming', 'Athletics', 'Cricket',
    'Badminton', 'Table Tennis', 'Hackathons', 'Technical',
    'Cultural', 'Academic'
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-section">
          <UserCircleIcon className="avatar-icon" />
          <h1>{user.name}</h1>
          <p className="email">{user.email}</p>
          <p className="role">{user.role}</p>
        </div>
        <div className="stats-section">
          <div className="stat-item">
            <TrophyIcon className="stat-icon" />
            <span>{user.totalPoints} Points</span>
          </div>
          <div className="stat-item">
            <CalendarIcon className="stat-icon" />
            <span>{user.participationHistory?.length || 0} Events</span>
          </div>
          <div className="stat-item">
            <ClockIcon className="stat-icon" />
            <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="section">
          <h2>Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interests</label>
                <div className="interests-grid">
                  {interests.map(interest => (
                    <label key={interest} className="interest-checkbox">
                      <input
                        type="checkbox"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInterestChange}
                      />
                      {interest}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  <CheckIcon className="icon" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cancel-button"
                >
                  <XMarkIcon className="icon" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-display">
              <div className="info-item">
                <BuildingOfficeIcon className="info-icon" />
                <span>{user.department}</span>
              </div>
              <div className="info-item">
                <AcademicCapIcon className="info-icon" />
                <span>{user.year}</span>
              </div>
              <div className="info-item">
                <span className="label">Interests:</span>
                <div className="interests-list">
                  {user.interests?.map(interest => (
                    <span key={interest} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                <PencilIcon className="icon" />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Participation History</h2>
          <div className="history-list">
            {user.participationHistory?.map((participation, index) => (
              <div key={index} className="history-item">
                <div className="event-info">
                  <h3>{participation.event?.title}</h3>
                  <p>{new Date(participation.date).toLocaleDateString()}</p>
                </div>
                <div className="participation-details">
                  <span className={`role ${participation.role}`}>
                    {participation.role}
                  </span>
                  <span className={`status ${participation.status}`}>
                    {participation.status}
                  </span>
                  <span className="points">
                    +{participation.pointsEarned} points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Achievements</h2>
          <div className="achievements-list">
            {user.achievements?.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <TrophyIcon className="achievement-icon" />
                <div className="achievement-info">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    {new Date(achievement.date).toLocaleDateString()}
                  </span>
                  <span className="achievement-points">
                    +{achievement.points} points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 