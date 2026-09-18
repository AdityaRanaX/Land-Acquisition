/**
 * Statutory RFCTLARR 2013 Compensation Calculation Engine
 */

/**
 * Compute Schedule I Compensation Award
 * @param {Object} params
 * @param {number} params.baseMarketValuePerAcre Base circle rate or avg sale deed rate
 * @param {number} params.acquiredAreaAcres Area in acres
 * @param {string} params.urbanOrRural 'URBAN' or 'RURAL'
 * @param {number} params.distanceFactor Rural distance multiplier (1.0 to 2.0)
 * @param {number} params.assetsStructures Value of buildings/wells/fences
 * @param {number} params.assetsTreesCrops Value of timber/fruit trees & standing crops
 * @param {number} params.interestDays Days between Sec 11 notification and Award Date
 */
const calculateStatutoryAward = ({
  baseMarketValuePerAcre = 0,
  acquiredAreaAcres = 0,
  urbanOrRural = 'RURAL',
  distanceFactor = 1.0,
  assetsStructures = 0,
  assetsTreesCrops = 0,
  interestDays = 0
}) => {
  // 1. Basic Land Value
  const basicLandValue = baseMarketValuePerAcre * acquiredAreaAcres;

  // 2. Multiplication Factor (RFCTLARR Sec 26(2) & First Schedule: 1.0 for urban, 1.0 - 2.0 for rural based on distance from urban area)
  const multiplicationFactor = urbanOrRural === 'URBAN' ? 1.0 : Math.max(1.0, Math.min(2.0, distanceFactor));
  const multipliedLandValue = basicLandValue * multiplicationFactor;

  // 3. Assets attached to land (Sec 29)
  const totalAssetsValue = Number(assetsStructures) + Number(assetsTreesCrops);

  // 4. Base total for Solatium calculation
  const totalBaseAssetAndLandValue = multipliedLandValue + totalAssetsValue;

  // 5. Solatium: 100% of base land + asset total (Sec 30(1))
  const solatiumPercentage = 100;
  const solatiumAmount = (totalBaseAssetAndLandValue * solatiumPercentage) / 100;

  // 6. 12% Additional market value per annum from Sec 11 to award date (Sec 30(3))
  let interest12PercentAdditionalValue = 0;
  if (interestDays > 0) {
    const years = interestDays / 365;
    interest12PercentAdditionalValue = multipliedLandValue * 0.12 * years;
  }

  // 7. Total Gross Award
  const totalGrossAwardINR = Math.round(
    totalBaseAssetAndLandValue + solatiumAmount + interest12PercentAdditionalValue
  );

  return {
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
  };
};

/**
 * What-If Simulation for project budget planning
 */
const simulateProjectBudget = (parcelsList = [], multiplierAdjustment = 1.0, solatiumPercent = 100) => {
  let totalBaseValue = 0;
  let totalMultiplied = 0;
  let totalSolatium = 0;
  let totalGrossEstimate = 0;

  parcelsList.forEach((parcel) => {
    const area = parcel.areaAcres || 1;
    const rate = parcel.baseMarketRatePerAcreINR || 1000000;
    const basic = area * rate;
    const multiplied = basic * multiplierAdjustment;
    const solatium = (multiplied * solatiumPercent) / 100;
    const total = multiplied + solatium;

    totalBaseValue += basic;
    totalMultiplied += multiplied;
    totalSolatium += solatium;
    totalGrossEstimate += total;
  });

  return {
    parcelsCount: parcelsList.length,
    multiplierApplied: multiplierAdjustment,
    solatiumPercentApplied: solatiumPercent,
    totalBaseValue: Math.round(totalBaseValue),
    totalMultiplied: Math.round(totalMultiplied),
    totalSolatium: Math.round(totalSolatium),
    totalGrossEstimate: Math.round(totalGrossEstimate)
  };
};

module.exports = {
  calculateStatutoryAward,
  simulateProjectBudget
};
