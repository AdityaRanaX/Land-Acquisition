const express = require('express');
const router = express.Router();
const {
  getGrievances,
  submitGrievance,
  updateGrievance
} = require('../controllers/grievances.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', getGrievances);
router.post('/', audit('SUBMIT_GRIEVANCE', 'GRIEVANCES'), submitGrievance);
router.put(
  '/:id',
  authorize('DISTRICT_COLLECTOR', 'STATE_OFFICER', 'CENTRAL_ADMIN'),
  audit('UPDATE_GRIEVANCE_STATUS', 'GRIEVANCES'),
  updateGrievance
);

module.exports = router;
