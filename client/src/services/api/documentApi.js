import apiClient from './apiClient';

export const documentApi = {
  getDocuments: (params) => apiClient.get('/documents', { params }),
  uploadDocument: (docData) => apiClient.post('/documents', docData),
  updateDocumentStatus: (id, data) => apiClient.patch(`/documents/${id}`, data),
  verifyDocument: (id) => apiClient.post(`/documents/${id}/verify`)
};

export default documentApi;
