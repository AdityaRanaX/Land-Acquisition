const express = require('express');
const router = express.Router();
const {
  getParcelsGeoJSON,
  getProjectsGeoJSON,
  getSingleParcelGeoJSON,
  getGISStats
} = require('../controllers/gis.controller');
const authenticate = require('../middleware/auth.middleware');
const { scopeJurisdiction } = require('../middleware/rbac.middleware');

router.use(authenticate);

// Specification endpoints
router.get('/projects', scopeJurisdiction, getProjectsGeoJSON);
router.get('/parcels', scopeJurisdiction, getParcelsGeoJSON);
router.get('/parcels/:id', getSingleParcelGeoJSON);

// Existing frontend backward-compatibility routes
router.get('/parcels-geojson', scopeJurisdiction, getParcelsGeoJSON);
router.get('/layer-stats', scopeJurisdiction, getGISStats);

module.exports = router;
