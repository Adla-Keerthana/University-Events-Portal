import { getNotifications, markNotificationAsRead } from './notificationSlice';

export const fetchNotifications = () => async (dispatch) => {
  try {
    await dispatch(getNotifications());
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

export const markAsRead = (notificationId) => async (dispatch) => {
  try {
    await dispatch(markNotificationAsRead(notificationId));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}; 