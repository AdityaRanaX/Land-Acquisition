const express = require('express');
const router = express.Router();
const {
  getParcels,
  getParcelById,
  createParcel,
  verifyParcelGroundSurvey
} = require('../controllers/parcels.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize, scopeJurisdiction } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', scopeJurisdiction, getParcels);
router.get('/:id', getParcelById);
router.post(
  '/',
  authorize('CENTRAL_ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'REQUIRING_AGENCY'),
  audit('CREATE_PARCEL', 'PARCELS'),
  createParcel
);
router.post(
  '/:id/field-verify',
  authorize('FIELD_SURVEYOR', 'DISTRICT_COLLECTOR', 'CENTRAL_ADMIN'),
  audit('FIELD_VERIFY_PARCEL', 'PARCELS'),
  verifyParcelGroundSurvey
);

module.exports = router;
