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
  getMe
};
