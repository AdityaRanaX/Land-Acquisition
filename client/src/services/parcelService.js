import { parcelApi, gisApi } from './api/index';

export const getParcels = async (filters = {}) => {
  const res = await parcelApi.getParcels(filters);
  return res.data;
};

export const getParcelById = async (id) => {
  const res = await parcelApi.getParcelById(id);
  return res.data;
};

export const verifyParcelGroundTruth = async (parcelId, verificationData) => {
  const res = await parcelApi.verifyGroundSurvey(parcelId, verificationData);
  return res.data;
};

export const getParcelsGeoJSON = async () => {
  const res = await gisApi.getParcelsGeoJSON();
  return res.data;
};
