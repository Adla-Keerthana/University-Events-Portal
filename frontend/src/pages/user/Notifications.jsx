import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead } from '../../store/slices/notificationSlice';
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markAsRead(notificationId));
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

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="notifications-count">
          <BellIcon className="bell-icon" />
          <span>{notifications?.length || 0} notifications</span>
        </div>
      </div>

      <div className="notifications-list">
        {notifications?.length === 0 ? (
          <div className="empty-notifications">
            <p>No notifications to display</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <ClockIcon className="clock-icon" />
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="mark-read-button"
                >
                  <CheckIcon className="check-icon" />
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 