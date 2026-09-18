const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

/**
 * Middleware that automatically logs state mutations (POST, PUT, PATCH, DELETE) to AuditLog collection
 */
const auditLogMiddleware = (actionDescription, moduleName) => {
  return async (req, res, next) => {
    // Intercept response to log only if successful
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (body && body.success) {
        try {
          const userId = req.user ? req.user._id : null;
          const userEmail = req.user ? req.user.email : 'Anonymous/System';
          const role = req.user ? req.user.role : 'GUEST';

          const record = {
            user: userId,
            userEmail,
            role,
            action: actionDescription || `${req.method} ${req.baseUrl}`,
            module: moduleName || 'SYSTEM',
            endpoint: req.originalUrl,
            method: req.method,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers['user-agent'],
            details: {
              body: req.method !== 'GET' ? req.body : undefined,
              params: req.params,
              query: req.query
            },
            timestamp: new Date()
          };

          AuditLog.create(record).catch((err) => {
            logger.warn(`AuditLog creation failed: ${err.message}`);
          });
        } catch (err) {
          logger.warn(`Audit middleware error: ${err.message}`);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLogMiddleware;
