const express = require('express');
const router = express.Router();
const {
  getRRPackages,
  createRRPackage,
  getFamilies,
  updateRRPackage
} = require('../controllers/rr.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', getRRPackages);
router.get('/families', getFamilies);
router.post(
  '/',
  authorize('DISTRICT_COLLECTOR', 'CENTRAL_ADMIN', 'STATE_OFFICER'),
  audit('SANCTION_RR_PACKAGE', 'RR'),
  createRRPackage
);
router.patch(
  '/:id',
  authorize('DISTRICT_COLLECTOR', 'CENTRAL_ADMIN', 'STATE_OFFICER'),
  audit('UPDATE_RR_PACKAGE', 'RR'),
  updateRRPackage
);

module.exports = router;
