import apiClient from './apiClient';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  verifyOtp: (data) => apiClient.post('/auth/verify-otp', data),
  getMe: () => apiClient.get('/auth/me')
};

export const userApi = {
  getUsers: (params) => apiClient.get('/users', { params }),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData)
};

export const projectApi = {
  getProjects: (params) => apiClient.get('/projects', { params }),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (projectData) => apiClient.post('/projects', projectData),
  updateMilestone: (id, milestoneData) => apiClient.put(`/projects/${id}/milestone`, milestoneData)
};

export const parcelApi = {
  getParcels: (params) => apiClient.get('/parcels', { params }),
  getParcelById: (id) => apiClient.get(`/parcels/${id}`),
  createParcel: (parcelData) => apiClient.post('/parcels', parcelData),
  verifyGroundSurvey: (id, surveyData) => apiClient.post(`/parcels/${id}/field-verify`, surveyData)
};

export const gisApi = {
  getParcelsGeoJSON: (params) => apiClient.get('/gis/parcels-geojson', { params }),
  getGISStats: (params) => apiClient.get('/gis/layer-stats', { params })
};

export const documentApi = {
  getDocuments: (params) => apiClient.get('/documents', { params }),
  uploadDocument: (docData) => apiClient.post('/documents', docData),
  verifyDocument: (id) => apiClient.post(`/documents/${id}/verify`)
};

export const compensationApi = {
  calculate: (data) => apiClient.post('/compensation/calculate', data),
  simulate: (data) => apiClient.post('/compensation/simulate', data),
  getAwards: (params) => apiClient.get('/compensation', { params }),
  createAward: (awardData) => apiClient.post('/compensation/award', awardData)
};

export const rrApi = {
  getRRPackages: (params) => apiClient.get('/rr', { params }),
  getFamilies: (params) => apiClient.get('/rr/families', { params }),
  createPackage: (data) => apiClient.post('/rr', data)
};

export const grievanceApi = {
  getGrievances: (params) => apiClient.get('/grievances', { params }),
  submitGrievance: (data) => apiClient.post('/grievances', data),
  updateGrievance: (id, data) => apiClient.put(`/grievances/${id}`, data)
};

export const notificationApi = {
  getMyNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`)
};
