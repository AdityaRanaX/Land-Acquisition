import apiClient from './apiClient';

export const userApi = {
  getUsers: (params) => apiClient.get('/users', { params }),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData)
};

export default userApi;
