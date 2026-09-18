const express = require('express');
const router = express.Router();
const { getParcelsGeoJSON, getGISStats } = require('../controllers/gis.controller');
const authenticate = require('../middleware/auth.middleware');
const { scopeJurisdiction } = require('../middleware/rbac.middleware');

router.use(authenticate);

router.get('/parcels-geojson', scopeJurisdiction, getParcelsGeoJSON);
router.get('/layer-stats', scopeJurisdiction, getGISStats);

module.exports = router;
