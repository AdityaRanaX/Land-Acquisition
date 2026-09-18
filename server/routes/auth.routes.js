const express = require('express');
const router = express.Router();
const {
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);

module.exports = router;
