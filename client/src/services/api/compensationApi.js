import apiClient from './apiClient';

export const compensationApi = {
  calculate: (data) => apiClient.post('/compensation/calculate', data),
  simulate: (data) => apiClient.post('/compensation/simulate', data),
  getAwards: (params) => apiClient.get('/compensation', { params }),
  createAward: (awardData) => apiClient.post('/compensation/award', awardData)
};

export default compensationApi;
