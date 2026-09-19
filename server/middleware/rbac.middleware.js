const ApiResponse = require('../utils/apiResponse');

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles Roles allowed to access the endpoint
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'User context not found');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Role '${req.user.role}' lacks necessary permissions.`
      );
    }

    next();
  };
};

/**
 * Jurisdiction filter helper to ensure users only access resources in their state or district
 */
const scopeJurisdiction = (req, res, next) => {
  if (!req.user) return next();

  req.jurisdictionFilter = {};

  if (req.user.role === 'CENTRAL_ADMIN') {
    // National scope, no filter applied
    return next();
  }

  if (req.user.role === 'STATE_OFFICER') {
    if (req.user.jurisdiction?.state) {
      req.jurisdictionFilter.state = req.user.jurisdiction.state;
    }
    return next();
  }

  if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
    if (req.user.jurisdiction?.state) {
      req.jurisdictionFilter.state = req.user.jurisdiction.state;
    }
    if (req.user.jurisdiction?.district) {
      req.jurisdictionFilter.district = req.user.jurisdiction.district;
      req.jurisdictionFilter.projectDistrict = req.user.jurisdiction.district;
    }
    return next();
  }

  if (req.user.role === 'REQUIRING_AGENCY') {
    if (req.user.jurisdiction?.agencyName) {
      req.jurisdictionFilter.requiringAgency = req.user.jurisdiction.agencyName;
    }
    return next();
  }

  if (req.user.role === 'CITIZEN') {
    req.jurisdictionFilter.citizenUser = req.user._id;
    return next();
  }

  next();
};

module.exports = {
  authorize,
  scopeJurisdiction
};
