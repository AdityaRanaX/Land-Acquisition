const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');

// @desc Get GeoJSON FeatureCollection of parcels for Leaflet GIS Map
// @route GET /api/gis/parcels-geojson
const getParcelsGeoJSON = async (req, res, next) => {
  try {
    const { projectId, status, district } = req.query;
    const filter = { ...req.jurisdictionFilter };

    if (projectId) filter.project = projectId;
    if (status) filter.acquisitionStatus = status;
    if (district) filter.district = district;

    const parcels = await Parcel.find(filter).populate('project', 'name code state');

    const features = parcels
      .filter((p) => p.geometry && p.geometry.coordinates)
      .map((p) => ({
        type: 'Feature',
        id: p._id,
        geometry: p.geometry,
        properties: {
          id: p._id,
          surveyNumber: p.surveyNumber,
          village: p.village,
          taluka: p.taluka,
          district: p.district,
          state: p.state,
          areaAcres: p.areaAcres,
          landType: p.landType,
          primaryOwnerName: p.primaryOwnerName,
          acquisitionStatus: p.acquisitionStatus,
          isVerified: p.fieldVerification?.isVerified || false,
          discrepancyDetected: p.fieldVerification?.discrepancyDetected || false,
          projectName: p.project?.name,
          projectCode: p.project?.code
        }
      }));

    const featureCollection = {
      type: 'FeatureCollection',
      features
    };

    return ApiResponse.success(res, featureCollection, 'GIS GeoJSON retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Get GIS Layer summary statistics
// @route GET /api/gis/layer-stats
const getGISStats = async (req, res, next) => {
  try {
    const filter = { ...req.jurisdictionFilter };

    const total = await Parcel.countDocuments(filter);
    const verified = await Parcel.countDocuments({ ...filter, 'fieldVerification.isVerified': true });
    const disputed = await Parcel.countDocuments({ ...filter, acquisitionStatus: 'DISPUTED' });
    const awarded = await Parcel.countDocuments({ ...filter, acquisitionStatus: 'AWARD_PRONOUNCED' });

    return ApiResponse.success(res, {
      totalParcels: total,
      verifiedParcels: verified,
      disputedParcels: disputed,
      awardedParcels: awarded,
      progressPercentage: total > 0 ? Math.round((verified / total) * 100) : 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParcelsGeoJSON,
  getGISStats
};
