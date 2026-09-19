const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');

// @desc Get list of parcels with filters
// @route GET /api/parcels
const getParcels = async (req, res, next) => {
  try {
    const { projectId, district, village, status, unverifiedOnly } = req.query;
    const filter = { ...req.jurisdictionFilter };
    delete filter.projectDistrict;

    if (projectId) filter.project = projectId;
    if (district) filter.district = district;
    if (village) filter.village = village;
    if (status) filter.acquisitionStatus = status;
    if (unverifiedOnly === 'true') {
      filter['fieldVerification.isVerified'] = false;
    }

    const parcels = await Parcel.find(filter)
      .populate('project', 'name code state')
      .populate('fieldVerification.verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, parcels, 'Parcels retrieved successfully', 200, { count: parcels.length });
  } catch (error) {
    next(error);
  }
};

// @desc Get single parcel details
// @route GET /api/parcels/:id
const getParcelById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role === 'STATE_OFFICER') filter.state = req.user.jurisdiction?.state;
    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      filter.state = req.user.jurisdiction?.state;
      filter.district = req.user.jurisdiction?.district;
    }
    if (req.user.role === 'CITIZEN') filter.citizenUser = req.user._id;

    const parcel = await Parcel.findOne(filter)
      .populate('project')
      .populate('citizenUser', 'name email phone');

    if (!parcel) {
      return ApiResponse.notFound(res, 'Parcel record not found');
    }

    return ApiResponse.success(res, parcel, 'Parcel details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Create parcel
// @route POST /api/parcels
const createParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.create(req.body);
    return ApiResponse.created(res, parcel, 'Parcel created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Field Survey Verification Submission (Field Officer)
// @route POST /api/parcels/:id/field-verify
const verifyParcelGroundSurvey = async (req, res, next) => {
  try {
    const { groundPhotos, fieldNotes, discrepancyDetected, discrepancyDetails } = req.body;
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      return ApiResponse.notFound(res, 'Parcel not found');
    }

    parcel.fieldVerification = {
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      groundPhotos: groundPhotos || [],
      fieldNotes,
      discrepancyDetected: Boolean(discrepancyDetected),
      discrepancyDetails: discrepancyDetails || ''
    };

    if (discrepancyDetected) {
      parcel.acquisitionStatus = 'DISPUTED';
    } else {
      parcel.acquisitionStatus = 'SURVEY_VERIFIED';
    }

    await parcel.save();

    return ApiResponse.success(res, parcel, 'Field survey verified and synced successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update parcel status, resolve discrepancy, or assign field officer
// @route PATCH /api/parcels/:id
const updateParcel = async (req, res, next) => {
  try {
    const {
      assignedSurveyor,
      acquisitionStatus,
      resolveDiscrepancy,
      baseMarketRatePerAcreINR,
      fieldNotes,
      primaryOwnerName,
      surveyNumber
    } = req.body;

    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return ApiResponse.notFound(res, 'Parcel not found');
    }

    if (assignedSurveyor) {
      if (!parcel.fieldVerification) parcel.fieldVerification = {};
      parcel.fieldVerification.verifiedBy = assignedSurveyor;
    }

    if (resolveDiscrepancy) {
      if (!parcel.fieldVerification) parcel.fieldVerification = {};
      parcel.fieldVerification.discrepancyDetected = false;
      parcel.fieldVerification.discrepancyDetails = `Resolved: ${fieldNotes || 'Verified by District Authority'}`;
      parcel.acquisitionStatus = 'SURVEY_VERIFIED';
    } else if (acquisitionStatus) {
      parcel.acquisitionStatus = acquisitionStatus;
    }

    if (baseMarketRatePerAcreINR !== undefined) parcel.baseMarketRatePerAcreINR = baseMarketRatePerAcreINR;
    if (primaryOwnerName) parcel.primaryOwnerName = primaryOwnerName;
    if (surveyNumber) parcel.surveyNumber = surveyNumber;
    if (fieldNotes && parcel.fieldVerification) parcel.fieldVerification.fieldNotes = fieldNotes;

    await parcel.save();

    return ApiResponse.success(res, parcel, 'Parcel updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParcels,
  getParcelById,
  createParcel,
  updateParcel,
  verifyParcelGroundSurvey
};
