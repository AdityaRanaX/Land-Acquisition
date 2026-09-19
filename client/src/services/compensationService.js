import { mockCompensations, mockRRPackages } from '../mock/compensation';

let compStore = [...mockCompensations];
let rrStore = [...mockRRPackages];

export const getCompensations = (filters = {}) => {
  let list = [...compStore];
  if (filters.projectId) {
    list = list.filter((c) => c.projectId === filters.projectId);
  }
  return Promise.resolve(list);
};

export const getCompensationByParcelId = (parcelId) => {
  const comp = compStore.find((c) => c.parcelId === parcelId || c.surveyNumber === parcelId);
  return Promise.resolve(comp || compStore[0]);
};

export const getRRPackages = (filters = {}) => {
  let list = [...rrStore];
  if (filters.projectId) {
    list = list.filter((r) => r.projectId === filters.projectId);
  }
  return Promise.resolve(list);
};

export const calculateStatutoryAward = ({
  baseMarketValuePerAcre = 0,
  acquiredAreaAcres = 0,
  urbanOrRural = 'RURAL',
  distanceFactor = 1.0,
  assetsStructures = 0,
  assetsTreesCrops = 0,
  interestDays = 0
}) => {
  const basicLandValue = baseMarketValuePerAcre * acquiredAreaAcres;
  const multiplicationFactor = urbanOrRural === 'URBAN' ? 1.0 : Math.max(1.0, Math.min(2.0, distanceFactor));
  const multipliedLandValue = basicLandValue * multiplicationFactor;
  const totalAssetsValue = Number(assetsStructures) + Number(assetsTreesCrops);
  const totalBaseAssetAndLandValue = multipliedLandValue + totalAssetsValue;
  const solatiumPercentage = 100;
  const solatiumAmount = (totalBaseAssetAndLandValue * solatiumPercentage) / 100;

  let interest12PercentAdditionalValue = 0;
  if (interestDays > 0) {
    const years = interestDays / 365;
    interest12PercentAdditionalValue = multipliedLandValue * 0.12 * years;
  }

  const totalGrossAwardINR = Math.round(totalBaseAssetAndLandValue + solatiumAmount + interest12PercentAdditionalValue);

  return Promise.resolve({
    baseMarketValuePerAcre,
    acquiredAreaAcres,
    basicLandValue,
    multiplicationFactor,
    multipliedLandValue,
    assetsValueStructures: Number(assetsStructures),
    assetsValueTreesCrops: Number(assetsTreesCrops),
    totalAssetsValue,
    totalBaseAssetAndLandValue,
    solatiumPercentage,
    solatiumAmount,
    interestDays,
    interest12PercentAdditionalValue: Math.round(interest12PercentAdditionalValue),
    totalGrossAwardINR
  });
};
