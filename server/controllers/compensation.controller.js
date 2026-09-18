const Compensation = require('../models/Compensation');
const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');
const { calculateStatutoryAward, simulateProjectBudget } = require('../services/compensationCalc.service');

// @desc Calculate statutory compensation dynamically
// @route POST /api/compensation/calculate
const calculateCompensation = async (req, res, next) => {
  try {
    const result = calculateStatutoryAward(req.body);
    return ApiResponse.success(res, result, 'Compensation calculated via RFCTLARR Schedule I');
  } catch (error) {
    next(error);
  }
};

// @desc Run What-If Budget Simulation for project
// @route POST /api/compensation/simulate
const simulateCompensation = async (req, res, next) => {
  try {
    const { projectId, multiplierAdjustment, solatiumPercent } = req.body;
    let parcels = [];
    if (projectId) {
      parcels = await Parcel.find({ project: projectId });
    }

    const simulation = simulateProjectBudget(parcels, multiplierAdjustment, solatiumPercent);
    return ApiResponse.success(res, simulation, 'What-If simulation computed');
  } catch (error) {
    next(error);
  }
};

// @desc Get compensation awards
// @route GET /api/compensation
const getCompensationAwards = async (req, res, next) => {
  try {
    const { projectId, parcelId, status } = req.query;
    const filter = {};

    if (projectId) filter.project = projectId;
    if (parcelId) filter.parcel = parcelId;
    if (status) filter.disbursementStatus = status;

    const awards = await Compensation.find(filter)
      .populate('parcel', 'surveyNumber village areaAcres primaryOwnerName landType')
      .populate('project', 'name code')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, awards, 'Awards retrieved', 200, { count: awards.length });
  } catch (error) {
    next(error);
  }
};

// @desc Pronounce/Create Compensation Award
// @route POST /api/compensation/award
const createAward = async (req, res, next) => {
  try {
    const { parcelId, projectId, baseMarketValuePerAcre, acquiredAreaAcres, urbanOrRural, distanceFactor, assetsStructures, assetsTreesCrops, interestDays, beneficiaryName, bankDetails } = req.body;

    const calc = calculateStatutoryAward({
      baseMarketValuePerAcre,
      acquiredAreaAcres,
      urbanOrRural,
      distanceFactor,
      assetsStructures,
      assetsTreesCrops,
      interestDays
    });

    const award = await Compensation.create({
      parcel: parcelId,
      project: projectId,
      beneficiaryName,
      bankDetails,
      ...calc,
      disbursementStatus: 'AWARD_APPROVED',
      calculatedBy: req.user._id
    });

    await Parcel.findByIdAndUpdate(parcelId, { acquisitionStatus: 'AWARD_PRONOUNCED' });

    return ApiResponse.created(res, award, 'Compensation award pronounced successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateCompensation,
  simulateCompensation,
  getCompensationAwards,
  createAward
};
