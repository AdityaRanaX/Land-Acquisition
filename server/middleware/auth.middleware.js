const { verifyToken } = require('../utils/tokenHelper');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Authentication token missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return ApiResponse.unauthorized(res, 'Invalid or expired token');
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return ApiResponse.unauthorized(res, 'User associated with token no longer exists');
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'User account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
};

module.exports = authenticate;
