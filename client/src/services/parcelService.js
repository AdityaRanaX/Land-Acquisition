import { mockParcels } from '../mock/parcels';

let parcelsStore = [...mockParcels];

export const getParcels = (filters = {}) => {
  let list = [...parcelsStore];
  if (filters.projectId) {
    list = list.filter((p) => p.projectId === filters.projectId);
  }
  if (filters.status) {
    list = list.filter((p) => p.acquisitionStatus === filters.status);
  }
  if (filters.district) {
    list = list.filter((p) => p.district.toLowerCase() === filters.district.toLowerCase());
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter((p) =>
      p.surveyNumber.toLowerCase().includes(s) ||
      p.primaryOwnerName.toLowerCase().includes(s) ||
      p.village.toLowerCase().includes(s)
    );
  }
  return Promise.resolve(list);
};

export const getParcelById = (id) => {
  const parcel = parcelsStore.find((p) => p.id === id || p.surveyNumber === id);
  return Promise.resolve(parcel || parcelsStore[0]);
};

export const verifyParcelGroundTruth = (parcelId, verificationData) => {
  parcelsStore = parcelsStore.map((p) => {
    if (p.id === parcelId || p.surveyNumber === parcelId) {
      return {
        ...p,
        acquisitionStatus: verificationData.discrepancyDetected ? 'DISPUTED' : 'VALUATION_COMPLETED',
        fieldVerification: {
          isVerified: true,
          verifiedAt: new Date().toISOString().split('T')[0],
          ...verificationData
        }
      };
    }
    return p;
  });
  return Promise.resolve(true);
};

export const getParcelsGeoJSON = () => {
  const features = parcelsStore.map((p) => ({
    type: 'Feature',
    id: p.id,
    geometry: p.geometry,
    properties: {
      id: p.id,
      surveyNumber: p.surveyNumber,
      village: p.village,
      taluka: p.taluka,
      district: p.district,
      areaAcres: p.areaAcres,
      landType: p.landType,
      primaryOwnerName: p.primaryOwnerName,
      acquisitionStatus: p.acquisitionStatus,
      isVerified: p.fieldVerification?.isVerified || false,
      discrepancyDetected: p.fieldVerification?.discrepancyDetected || false,
      projectName: p.projectName
    }
  }));

  return Promise.resolve({
    type: 'FeatureCollection',
    features
  });
};
