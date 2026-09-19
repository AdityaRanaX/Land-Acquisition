import { grievanceApi } from './api/index';

export const getGrievances = async (filters = {}) => {
  const res = await grievanceApi.getGrievances(filters);
  return res.data;
};

export const getGrievanceById = async (id) => {
  const res = await grievanceApi.getGrievances({ id });
  return res.data[0];
};

export const submitGrievance = async (grievanceData) => {
  const res = await grievanceApi.submitGrievance(grievanceData);
  return res.data;
};
