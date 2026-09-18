const express = require('express');
const router = express.Router();
const { login, verifyOtp, getMe } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/me', authenticate, getMe);

module.exports = router;
