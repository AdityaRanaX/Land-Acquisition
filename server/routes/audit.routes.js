const express = require('express');
const router = express.Router();
const { getAuditLogs, getDelayRadarData } = require('../controllers/audit.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize, scopeJurisdiction } = require('../middleware/rbac.middleware');

router.use(authenticate);

// Delay radar accessible to all authenticated administrative roles
router.get('/delay-radar', scopeJurisdiction, getDelayRadarData);

// Audit logs restricted to senior administrative personnel
router.get(
  '/',
  authorize('CENTRAL_ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR'),
  scopeJurisdiction,
  getAuditLogs
);

module.exports = router;
