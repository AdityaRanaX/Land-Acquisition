import { compensationApi } from './api/index';

export const getCompensations = async (filters = {}) => {
  const res = await compensationApi.getAwards(filters);
  return res.data;
};

export const getCompensationByParcelId = async (parcelId) => {
  const res = await compensationApi.getAwards({ parcelId });
  return res.data[0];
};

export const calculateStatutoryAward = async (data) => {
  const res = await compensationApi.calculate(data);
  return res.data;
};
