const logger = require('../utils/logger');
const env = require('../config/env');

const inMemoryOtpStore = new Map();

/**
 * Generate a 6-digit numeric OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via email / SMS (supports mock console mode)
 */
const sendOTP = async (email, otp) => {
  const expiresAt = Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000;
  inMemoryOtpStore.set(email, { otp, expiresAt });

  if (env.EMAIL_SERVICE_MOCK) {
    logger.info(`[MOCK OTP SERVICE] Verification OTP for ${email} is: ===> [ ${otp} ] <=== (Expires in ${env.OTP_EXPIRY_MINUTES}m)`);
    return { success: true, mock: true, otp };
  }

  // In production, nodemailer or SMS gateway would be integrated here
  return { success: true };
};

/**
 * Verify if OTP is valid and non-expired
 */
const verifyStoredOTP = (email, inputOtp) => {
  const record = inMemoryOtpStore.get(email);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    inMemoryOtpStore.delete(email);
    return false;
  }

  const isValid = record.otp === inputOtp;
  if (isValid) {
    inMemoryOtpStore.delete(email);
  }
  return isValid;
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyStoredOTP
};
