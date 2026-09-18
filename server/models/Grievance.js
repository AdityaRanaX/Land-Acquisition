const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    citizenName: {
      type: String,
      required: true
    },
    citizenPhone: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true
    },
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcel',
      index: true
    },
    category: {
      type: String,
      enum: [
        'VALUATION_DISPUTE',
        'OWNERSHIP_TITLE_CONFLICT',
        'BOUNDARY_SURVEY_MISMATCH',
        'RR_ENTITLEMENT_OMISSION',
        'PAYMENT_DELAY_ESCROW',
        'SIA_OBJECTION_SECTION_15',
        'CORRUPTION_MALPRACTICE',
        'OTHER'
      ],
      required: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'UNDER_INVESTIGATION',
        'HEARING_SCHEDULED',
        'ESCALATED_TO_COLLECTOR',
        'RESOLVED',
        'REJECTED'
      ],
      default: 'SUBMITTED',
      index: true
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hearingDate: Date,
    hearingRemarks: String,
    resolutionSummary: String,
    resolvedAt: Date,
    documentsAttached: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
