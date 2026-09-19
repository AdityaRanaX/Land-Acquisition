const AuditLog = require('../models/AuditLog');
const Project = require('../models/Project');
const Parcel = require('../models/Parcel');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { scanAllProjectsForDelays, evaluateProjectDelays } = require('../services/delayRadar.service');

// @desc Get immutable audit logs
// @route GET /api/audit
const getAuditLogs = async (req, res, next) => {
  try {
    const { module: mod, userEmail, limit = 50 } = req.query;
    const filter = {};

    if (mod) filter.module = mod;
    if (userEmail) filter.userEmail = userEmail;

    if (req.user.role === 'DISTRICT_COLLECTOR') {
      const [projects, parcels, users] = await Promise.all([
        Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id'),
        Parcel.find({ state: req.user.jurisdiction?.state, district: req.user.jurisdiction?.district }).select('_id'),
        User.find({ 'jurisdiction.state': req.user.jurisdiction?.state, 'jurisdiction.district': req.user.jurisdiction?.district }).select('_id')
      ]);
      const projectIds = projects.map((project) => project._id);
      const parcelIds = parcels.map((parcel) => parcel._id);
      const userIds = users.map((user) => user._id);
      filter.$or = [
        { user: { $in: userIds } },
        { 'details.body.projectId': { $in: projectIds } },
        { 'details.body.project': { $in: projectIds } },
        { 'details.body.parcelId': { $in: parcelIds } },
        { 'details.body.parcel': { $in: parcelIds } }
      ];
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));

    return ApiResponse.success(res, logs, 'Audit trail retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Get statutory delay radar evaluation for all projects
// @route GET /api/delay-radar
const getDelayRadarData = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (projectId) {
      const evaluation = await evaluateProjectDelays(projectId, req.jurisdictionFilter);
      return ApiResponse.success(res, evaluation, 'Project delay analysis retrieved');
    }

    const evaluations = await scanAllProjectsForDelays(req.jurisdictionFilter);
    return ApiResponse.success(res, evaluations, 'Delay radar scans retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getDelayRadarData
};
