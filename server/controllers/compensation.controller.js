const Compensation = require('../models/Compensation');
const Parcel = require('../models/Parcel');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { calculateStatutoryAward, simulateProjectBudget } = require('../services/compensationCalc.service');
const { createNotification } = require('../services/notification.service');

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

    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const projects = await Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id');
      const parcels = await Parcel.find({ state: req.user.jurisdiction?.state, district: req.user.jurisdiction?.district }).select('_id');
      filter.$or = [
        { project: { $in: projects.map((project) => project._id) } },
        { parcel: { $in: parcels.map((parcel) => parcel._id) } }
      ];
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      const projects = await Project.find({ state: req.user.jurisdiction.state }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'REQUIRING_AGENCY' && req.user.jurisdiction?.agencyName) {
      const projects = await Project.find({ requiringAgency: req.user.jurisdiction.agencyName }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'CITIZEN') {
      const parcels = await Parcel.find({ citizenUser: req.user._id }).select('_id');
      filter.parcel = { $in: parcels.map((parcel) => parcel._id) };
    }

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

// @desc Get single compensation award
// @route GET /api/compensation/:id
const getCompensationById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const projects = await Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id');
      const parcels = await Parcel.find({ state: req.user.jurisdiction?.state, district: req.user.jurisdiction?.district }).select('_id');
      filter.$or = [
        { project: { $in: projects.map((project) => project._id) } },
        { parcel: { $in: parcels.map((parcel) => parcel._id) } }
      ];
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      const projects = await Project.find({ state: req.user.jurisdiction.state }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'CITIZEN') {
      const parcels = await Parcel.find({ citizenUser: req.user._id }).select('_id');
      filter.parcel = { $in: parcels.map((parcel) => parcel._id) };
    }

    const award = await Compensation.findOne(filter)
      .populate('parcel')
      .populate('project', 'name code state')
      .populate('calculatedBy', 'name email');

    if (!award) {
      return ApiResponse.notFound(res, 'Compensation award record not found');
    }

    return ApiResponse.success(res, award, 'Compensation award retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Update compensation disbursement status (Pending -> Processing -> Paid)
// @route PATCH /api/compensation/:id
const updateCompensationStatus = async (req, res, next) => {
  try {
    const { disbursementStatus, status, utrTransactionNumber, disbursedAmountINR } = req.body;
    const award = await Compensation.findById(req.params.id).populate('parcel');

    if (!award) {
      return ApiResponse.notFound(res, 'Compensation award not found');
    }

    const newStatus = disbursementStatus || status;
    if (newStatus) {
      award.disbursementStatus = newStatus;
    }

    if (utrTransactionNumber) award.transactionReference = utrTransactionNumber;

    if (newStatus === 'DISBURSED') {
      award.disbursedDate = new Date();
      if (award.parcel) {
        await Parcel.findByIdAndUpdate(award.parcel._id || award.parcel, {
          acquisitionStatus: 'COMPENSATION_PAID'
        });
      }

      // Notify citizen if citizen user is mapped
      await createNotification({
        recipientRole: 'CITIZEN',
        title: 'Compensation Disbursed',
        message: `Statutory compensation of ₹${award.totalGrossAwardINR?.toLocaleString('en-IN') || 'Award'} has been disbursed to your account.`,
        severity: 'SUCCESS',
        link: '/citizen/compensation'
      });
    }

    await award.save();

    return ApiResponse.success(res, award, 'Compensation status updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateCompensation,
  simulateCompensation,
  getCompensationAwards,
  getCompensationById,
  createAward,
  updateCompensationStatus
};
