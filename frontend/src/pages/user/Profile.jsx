import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../store/slices/authSlice';
import {
  UserCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Check authentication and fetch profile data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!user && !loading) {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, user, loading]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword, ...profileData } = formData;
    
    if (newPassword && newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const updateData = {
      ...profileData,
      ...(newPassword && { currentPassword, newPassword }),
    };

    try {
      await dispatch(updateProfile(updateData));
      setIsEditing(false);
      // Refresh profile data after update
      await dispatch(getProfile());
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Please sign in to view your profile</p>
        </div>
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
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-profile-button"
          >
            <PencilIcon className="edit-icon" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="info-section">
          <h2 className="section-title">Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </form>
          ) : (
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
          )}
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