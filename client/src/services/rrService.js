import { rrApi } from './api/index';

export const getRRPackages = async (filters = {}) => {
  const res = await rrApi.getRRPackages(filters);
  return res.data;
};
