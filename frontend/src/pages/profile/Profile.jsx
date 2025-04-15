import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  UserCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">Please sign in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-section">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              <UserCircleIcon className="avatar-icon" />
            </div>
          )}
          <h1 className="user-name">{user.name}</h1>
          <span className="user-role">{user.role}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="info-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <EnvelopeIcon className="info-icon" />
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{user.email}</p>
              </div>
            </div>
            <div className="info-item">
              <AcademicCapIcon className="info-icon" />
              <div>
                <p className="info-label">Department</p>
                <p className="info-value">{user.department || 'Not specified'}</p>
              </div>
            </div>
            <div className="info-item">
              <CalendarIcon className="info-icon" />
              <div>
                <p className="info-label">Member Since</p>
                <p className="info-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="info-item">
              <ShieldCheckIcon className="info-icon" />
              <div>
                <p className="info-label">Account Type</p>
                <p className="info-value">
                  {user.role === 'committee_member' ? 'Committee Member' : 'Student'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-section">
          <h2 className="section-title">Activity Summary</h2>
          <div className="activity-grid">
            <div className="activity-card">
              <h3 className="activity-title">Events Attended</h3>
              <p className="activity-value">{user.eventsAttended || 0}</p>
            </div>
            <div className="activity-card">
              <h3 className="activity-title">Events Organized</h3>
              <p className="activity-value">{user.eventsOrganized || 0}</p>
            </div>
            <div className="activity-card">
              <h3 className="activity-title">Points Earned</h3>
              <p className="activity-value">{user.points || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 