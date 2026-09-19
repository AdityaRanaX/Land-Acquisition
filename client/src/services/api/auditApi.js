import apiClient from './apiClient';

export const auditApi = {
  getDelayRadarData: (params) => apiClient.get('/audit/delay-radar', { params }),
  getAuditLogs: (params) => apiClient.get('/audit', { params })
};

export default auditApi;
