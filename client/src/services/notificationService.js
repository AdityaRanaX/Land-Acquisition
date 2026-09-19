import { mockNotifications } from '../mock/notifications';

let notificationsStore = [...mockNotifications];

export const getNotifications = () => {
  return Promise.resolve(notificationsStore);
};

export const markNotificationRead = (id) => {
  notificationsStore = notificationsStore.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  return Promise.resolve(true);
};

export const markAllNotificationsRead = () => {
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
  return Promise.resolve(true);
};
