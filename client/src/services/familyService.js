import { rrApi } from './api/index';

export const getFamilies = async (filters = {}) => {
  const res = await rrApi.getFamilies(filters);
  return res.data;
};

export const getFamilyById = async (id) => {
  const res = await rrApi.getFamilies({ id });
  return res.data[0];
};
