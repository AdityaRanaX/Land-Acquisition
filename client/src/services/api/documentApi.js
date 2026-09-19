import apiClient from './apiClient';

export const documentApi = {
  getDocuments: (params) => apiClient.get('/documents', { params }),
  uploadDocument: (docData) => apiClient.post('/documents', docData),
  verifyDocument: (id) => apiClient.post(`/documents/${id}/verify`)
};

export default documentApi;
