const User = require('../models/User');
const { generateToken } = require('../utils/tokenHelper');
const ApiResponse = require('../utils/apiResponse');
const { generateOTP, sendOTP, verifyStoredOTP } = require('../services/otp.service');

// @desc Authenticate user & issue token or trigger OTP
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      await sendOTP(user.email, otp);
      return ApiResponse.success(
        res,
        { requires2FA: true, email: user.email },
        '2FA OTP sent to your registered email/phone'
      );
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });

    const userObj = user.toObject();
    delete userObj.password;

    return ApiResponse.success(res, { token, user: userObj }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP for 2FA
// @route POST /api/auth/verify-otp
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ApiResponse.badRequest(res, 'Email and OTP are required');
    }

    const isValid = verifyStoredOTP(email, otp);
    if (!isValid) {
      return ApiResponse.badRequest(res, 'Invalid or expired OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });

    return ApiResponse.success(res, { token, user }, '2FA verification successful');
  } catch (error) {
    next(error);
  }
};

// @desc Resend OTP for 2FA or password recovery
// @route POST /api/auth/resend-otp
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    const otp = generateOTP();
    await sendOTP(email, otp);

    return ApiResponse.success(res, { email }, 'A fresh OTP has been sent');
  } catch (error) {
    next(error);
  }
};

// @desc Request Password Reset OTP
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.notFound(res, 'No user found with this email');
    }

    const otp = generateOTP();
    await sendOTP(email, otp);

    return ApiResponse.success(
      res,
      { email },
      'Password reset OTP sent to registered email'
    );
  } catch (error) {
    next(error);
  }
};

// @desc Reset Password with OTP
// @route POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return ApiResponse.badRequest(res, 'Email, OTP, and new password are required');
    }

    if (newPassword.length < 6) {
      return ApiResponse.badRequest(res, 'Password must be at least 6 characters');
    }

    const isValid = verifyStoredOTP(email, otp);
    if (!isValid) {
      return ApiResponse.badRequest(res, 'Invalid or expired OTP');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, null, 'Password successfully reset. Please log in with your new password');
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, user, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  getMe
};
