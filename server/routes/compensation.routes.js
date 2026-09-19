const express = require('express');
const router = express.Router();
const {
  calculateCompensation,
  simulateCompensation,
  getCompensationAwards,
  getCompensationById,
  createAward,
  updateCompensationStatus
} = require('../controllers/compensation.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.post('/calculate', calculateCompensation);
router.post('/simulate', simulateCompensation);
router.get('/', getCompensationAwards);
router.get('/:id', getCompensationById);
router.post(
  '/award',
  authorize('DISTRICT_COLLECTOR', 'CENTRAL_ADMIN', 'STATE_OFFICER'),
  audit('PRONOUNCE_COMPENSATION_AWARD', 'COMPENSATION'),
  createAward
);
router.patch(
  '/:id',
  authorize('DISTRICT_COLLECTOR', 'CENTRAL_ADMIN', 'STATE_OFFICER'),
  audit('UPDATE_COMPENSATION_STATUS', 'COMPENSATION'),
  updateCompensationStatus
);

module.exports = router;
