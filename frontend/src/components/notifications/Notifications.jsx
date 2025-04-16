import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markNotificationAsRead } from '../../features/notifications/notificationSlice';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const NotificationItem = ({ notification, onClick }) => (
  <div
    onClick={onClick}
    className={`group px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
      !notification.read ? 'bg-primary-50' : ''
    }`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${!notification.read ? 'text-primary-900' : 'text-gray-900'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-700">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {!notification.read && (
        <div className="flex-shrink-0">
          <div className="h-2.5 w-2.5 bg-primary-500 rounded-full ring-2 ring-primary-500/30"></div>
        </div>
      )}
    </div>
  </div>
);

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleNotificationClick = async (notificationId) => {
    await dispatch(markNotificationAsRead(notificationId));
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => !n.read && dispatch(markNotificationAsRead(n._id)));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[32rem] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification._id)}
                    />
                  ))}
                  {unreadCount > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;