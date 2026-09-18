const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userEmail: {
      type: String,
      default: 'SYSTEM'
    },
    role: {
      type: String,
      default: 'GUEST'
    },
    action: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true,
      index: true
    },
    endpoint: String,
    method: String,
    ipAddress: String,
    userAgent: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
