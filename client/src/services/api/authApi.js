import apiClient from './apiClient';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  verifyOtp: (data) => apiClient.post('/auth/verify-otp', data),
  getMe: () => apiClient.get('/auth/me')
};

export default authApi;
