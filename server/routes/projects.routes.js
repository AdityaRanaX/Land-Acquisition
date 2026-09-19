const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateMilestone,
  simulateDelayImpact,
  getProjectSummaryReport
} = require('../controllers/projects.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize, scopeJurisdiction } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

// Reports & Simulations (before /:id)
router.get('/reports/summary', scopeJurisdiction, getProjectSummaryReport);
router.post('/simulate', simulateDelayImpact);

router.get('/', scopeJurisdiction, getProjects);
router.get('/:id', getProjectById);
router.post(
  '/',
  authorize('CENTRAL_ADMIN', 'REQUIRING_AGENCY', 'STATE_OFFICER'),
  audit('CREATE_PROJECT_REQUISITION', 'PROJECTS'),
  createProject
);
router.patch(
  '/:id',
  authorize('CENTRAL_ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'REQUIRING_AGENCY'),
  audit('UPDATE_PROJECT', 'PROJECTS'),
  updateProject
);
router.put(
  '/:id/milestone',
  authorize('CENTRAL_ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR'),
  audit('UPDATE_PROJECT_MILESTONE', 'PROJECTS'),
  updateMilestone
);

module.exports = router;
