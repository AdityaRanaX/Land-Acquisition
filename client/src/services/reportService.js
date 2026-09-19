import { gisApi } from './api/index';

export const getNationalStats = async () => {
  const res = await gisApi.getGISStats();
  return res.data;
};

export const getStateStats = async () => {
  const res = await gisApi.getGISStats();
  return res.data;
};
