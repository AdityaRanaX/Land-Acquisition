const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    recipientRole: {
      type: String,
      enum: [
        'ALL',
        'CENTRAL_ADMIN',
        'STATE_OFFICER',
        'DISTRICT_COLLECTOR',
        'REQUIRING_AGENCY',
        'FIELD_SURVEYOR',
        'CITIZEN'
      ]
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['ALERT', 'MILESTONE_UPDATE', 'PAYMENT_DISBURSED', 'GRIEVANCE_UPDATE', 'DELAY_RADAR_WARNING', 'DOCUMENT_VERIFIED'],
      default: 'ALERT'
    },
    severity: {
      type: String,
      enum: ['INFO', 'WARNING', 'CRITICAL', 'SUCCESS'],
      default: 'INFO'
    },
    link: String,
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
