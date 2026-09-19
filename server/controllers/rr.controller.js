const RR = require('../models/RR');
const Family = require('../models/Family');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

// @desc Get R&R packages
// @route GET /api/rr
const getRRPackages = async (req, res, next) => {
  try {
    const { projectId, status, familyId } = req.query;
    const filter = {};

    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const projects = await Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      const projects = await Project.find({ state: req.user.jurisdiction.state }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'REQUIRING_AGENCY' && req.user.jurisdiction?.agencyName) {
      const projects = await Project.find({ requiringAgency: req.user.jurisdiction.agencyName }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    }

    if (projectId) filter.project = projectId;
    if (status) filter.deliveryStatus = status;
    if (familyId) filter.family = familyId;

    const packages = await RR.find(filter)
      .populate('family')
      .populate('project', 'name code state')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, packages, 'R&R packages retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Create or Sanction R&R entitlement
// @route POST /api/rr
const createRRPackage = async (req, res, next) => {
  try {
    const {
      familyId,
      projectId,
      beneficiaryName,
      houseConstructedOrProvided,
      oneTimeResettlementAllowanceINR,
      subsistenceGrantPerMonthINR,
      subsistencePeriodMonths,
      transportationAllowanceINR,
      cattleShedPettyShopGrantINR,
      artisanGrantINR,
      skillDevelopmentTrainingOffered,
      mandatoryEmploymentOffered
    } = req.body;

    const houseAmount = houseConstructedOrProvided?.optedCashInLieu ? (houseConstructedOrProvided.cashAmountINR || 300000) : 0;
    const subsistenceTotal = (subsistenceGrantPerMonthINR || 3000) * (subsistencePeriodMonths || 12);
    const oneTime = oneTimeResettlementAllowanceINR || 50000;
    const transport = transportationAllowanceINR || 50000;
    const cattleOrShop = cattleShedPettyShopGrantINR || 0;
    const artisan = artisanGrantINR || 0;

    const totalRRAmountINR = houseAmount + subsistenceTotal + oneTime + transport + cattleOrShop + artisan;

    const rrPackage = await RR.create({
      family: familyId,
      project: projectId,
      beneficiaryName,
      houseConstructedOrProvided,
      oneTimeResettlementAllowanceINR: oneTime,
      subsistenceGrantPerMonthINR: subsistenceGrantPerMonthINR || 3000,
      subsistencePeriodMonths: subsistencePeriodMonths || 12,
      transportationAllowanceINR: transport,
      cattleShedPettyShopGrantINR: cattleOrShop,
      artisanGrantINR: artisan,
      skillDevelopmentTrainingOffered: Boolean(skillDevelopmentTrainingOffered),
      mandatoryEmploymentOffered: Boolean(mandatoryEmploymentOffered),
      totalRRAmountINR,
      deliveryStatus: 'SANCTIONED',
      sanctionedDate: new Date()
    });

    return ApiResponse.created(res, rrPackage, 'R&R Package sanctioned');
  } catch (error) {
    next(error);
  }
};

// @desc Get affected families
// @route GET /api/rr/families
const getFamilies = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const filter = {};
    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const projects = await Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      filter.project = { $in: (await Project.find({ state: req.user.jurisdiction.state }).select('_id')).map((project) => project._id) };
    }
    if (projectId) filter.project = projectId;

    const families = await Family.find(filter)
      .populate('project', 'name code')
      .populate('parcels', 'surveyNumber village');

    return ApiResponse.success(res, families, 'Affected families retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Update R&R package delivery status
// @route PATCH /api/rr/:id
const updateRRPackage = async (req, res, next) => {
  try {
    const { deliveryStatus, status, completedDate, remarks } = req.body;
    const rrPackage = await RR.findById(req.params.id);

    if (!rrPackage) {
      return ApiResponse.notFound(res, 'R&R package not found');
    }

    const requestedStatus = deliveryStatus || status;
    const newStatus = requestedStatus === 'COMPLETED' ? 'FULLY_DELIVERED' : requestedStatus;
    if (newStatus) {
      rrPackage.deliveryStatus = newStatus;
    }

    if (completedDate || newStatus === 'FULLY_DELIVERED') {
      rrPackage.completedDate = completedDate || new Date();
    }

    if (remarks) rrPackage.remarks = remarks;

    await rrPackage.save();

    return ApiResponse.success(res, rrPackage, 'R&R package updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRRPackages,
  createRRPackage,
  getFamilies,
  updateRRPackage
};
