import apiClient from './apiClient';

export const rrApi = {
  getRRPackages: (params) => apiClient.get('/rr', { params }),
  getFamilies: (params) => apiClient.get('/rr/families', { params }),
  createPackage: (data) => apiClient.post('/rr', data)
};

export default rrApi;
