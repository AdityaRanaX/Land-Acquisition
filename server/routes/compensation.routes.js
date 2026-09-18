const express = require('express');
const router = express.Router();
const {
  calculateCompensation,
  simulateCompensation,
  getCompensationAwards,
  createAward
} = require('../controllers/compensation.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.post('/calculate', calculateCompensation);
router.post('/simulate', simulateCompensation);
router.get('/', getCompensationAwards);
router.post(
  '/award',
  authorize('DISTRICT_COLLECTOR', 'CENTRAL_ADMIN', 'STATE_OFFICER'),
  audit('PRONOUNCE_COMPENSATION_AWARD', 'COMPENSATION'),
  createAward
);

module.exports = router;
