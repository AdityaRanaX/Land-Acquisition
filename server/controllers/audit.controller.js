const AuditLog = require('../models/AuditLog');
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
      const evaluation = await evaluateProjectDelays(projectId);
      return ApiResponse.success(res, evaluation, 'Project delay analysis retrieved');
    }

    const evaluations = await scanAllProjectsForDelays();
    return ApiResponse.success(res, evaluations, 'Delay radar scans retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getDelayRadarData
};
