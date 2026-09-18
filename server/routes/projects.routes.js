const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateMilestone
} = require('../controllers/projects.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize, scopeJurisdiction } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', scopeJurisdiction, getProjects);
router.get('/:id', getProjectById);
router.post(
  '/',
  authorize('CENTRAL_ADMIN', 'REQUIRING_AGENCY', 'STATE_OFFICER'),
  audit('CREATE_PROJECT_REQUISITION', 'PROJECTS'),
  createProject
);
router.put(
  '/:id/milestone',
  authorize('CENTRAL_ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR'),
  audit('UPDATE_PROJECT_MILESTONE', 'PROJECTS'),
  updateMilestone
);

module.exports = router;
