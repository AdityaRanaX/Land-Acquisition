const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getMe,
  updateMe,
  updateUser
} = require('../controllers/users.controller');
const authenticate = require('../middleware/auth.middleware');
const { authorize, scopeJurisdiction } = require('../middleware/rbac.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', audit('UPDATE_MY_PROFILE', 'USERS'), updateMe);

router.get('/', scopeJurisdiction, getUsers);
router.post('/', authorize('CENTRAL_ADMIN', 'STATE_OFFICER'), audit('CREATE_USER', 'USERS'), createUser);
router.put('/:id', authorize('CENTRAL_ADMIN', 'STATE_OFFICER'), audit('UPDATE_USER', 'USERS'), updateUser);

module.exports = router;
