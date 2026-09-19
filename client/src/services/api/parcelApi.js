import apiClient from './apiClient';

export const parcelApi = {
  getParcels: (params) => apiClient.get('/parcels', { params }),
  getParcelById: (id) => apiClient.get(`/parcels/${id}`),
  createParcel: (parcelData) => apiClient.post('/parcels', parcelData),
  verifyGroundSurvey: (id, surveyData) => apiClient.post(`/parcels/${id}/field-verify`, surveyData)
};

export default parcelApi;
