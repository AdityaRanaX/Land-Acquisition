import apiClient from './apiClient';

export const notificationApi = {
  getMyNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`)
};

export default notificationApi;
