import { notificationApi } from './api/index';

export const getNotifications = async () => {
  const res = await notificationApi.getMyNotifications();
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const markNotificationRead = async (id) => {
  const res = await notificationApi.markAsRead(id);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  return true;
};
