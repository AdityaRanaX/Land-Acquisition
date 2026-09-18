const Parcel = require('../models/Parcel');
const Project = require('../models/Project');
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

// @desc Get GeoJSON FeatureCollection of projects for Leaflet GIS Map
// @route GET /api/gis/projects
const getProjectsGeoJSON = async (req, res, next) => {
  try {
    const filter = { ...req.jurisdictionFilter };
    const projects = await Project.find(filter);

    // Build GeoJSON features for projects
    const features = projects.map((p) => {
      // If project has coordinates or fallback sample coordinates based on district
      const sampleCoords = [
        [73.85, 18.52],
        [73.95, 18.55],
        [74.05, 18.60]
      ];

      return {
        type: 'Feature',
        id: p._id,
        geometry: {
          type: 'LineString',
          coordinates: sampleCoords
        },
        properties: {
          id: p._id,
          name: p.name,
          code: p.code,
          state: p.state,
          districts: p.districts,
          status: p.status,
          riskLevel: p.riskLevel,
          totalAreaRequiredHectares: p.totalAreaRequiredHectares,
          estimatedBudgetINR: p.estimatedBudgetINR
        }
      };
    });

    return ApiResponse.success(
      res,
      {
        type: 'FeatureCollection',
        features
      },
      'Project GIS GeoJSON retrieved'
    );
  } catch (error) {
    next(error);
  }
};

// @desc Get single parcel GeoJSON
// @route GET /api/gis/parcels/:id
const getSingleParcelGeoJSON = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id).populate('project', 'name code state');
    if (!parcel) {
      return ApiResponse.notFound(res, 'Parcel not found');
    }

    const feature = {
      type: 'Feature',
      id: parcel._id,
      geometry: parcel.geometry,
      properties: {
        id: parcel._id,
        surveyNumber: parcel.surveyNumber,
        village: parcel.village,
        taluka: parcel.taluka,
        district: parcel.district,
        state: parcel.state,
        areaAcres: parcel.areaAcres,
        landType: parcel.landType,
        primaryOwnerName: parcel.primaryOwnerName,
        acquisitionStatus: parcel.acquisitionStatus,
        isVerified: parcel.fieldVerification?.isVerified || false,
        discrepancyDetected: parcel.fieldVerification?.discrepancyDetected || false,
        projectName: parcel.project?.name,
        projectCode: parcel.project?.code
      }
    };

    return ApiResponse.success(res, feature, 'Single parcel GeoJSON retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParcelsGeoJSON,
  getProjectsGeoJSON,
  getSingleParcelGeoJSON,
  getGISStats
};
