const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');

// @desc Get list of parcels with filters
// @route GET /api/parcels
const getParcels = async (req, res, next) => {
  try {
    const { projectId, district, village, status, unverifiedOnly } = req.query;
    const filter = { ...req.jurisdictionFilter };

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
    const parcel = await Parcel.findById(req.params.id)
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

module.exports = {
  getParcels,
  getParcelById,
  createParcel,
  verifyParcelGroundSurvey
};
