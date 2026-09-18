const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  section: {
    type: String,
    enum: [
      'SEC_4_SIA',
      'SEC_6_SIA_APPROVAL',
      'SEC_11_PRELIMINARY_NOTIF',
      'SEC_15_OBJECTIONS_HEARING',
      'SEC_19_DECLARATION',
      'SEC_23_VALUATION_AWARD',
      'SEC_31_RR_AWARD',
      'SEC_38_POSSESSION'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'],
    default: 'PENDING'
  },
  targetDate: Date,
  completedDate: Date,
  gazetteNotificationNumber: String,
  remarks: String
});

const projectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    purpose: {
      type: String,
      enum: [
        'HIGHWAYS_ROADS',
        'RAILWAYS_CORRIDOR',
        'METRO_RAIL',
        'AIRPORT_PORT',
        'IRRIGATION_DAM',
        'DEFENSE_SECURITY',
        'INDUSTRIAL_CORRIDOR',
        'POWER_ENERGY',
        'OTHER_PUBLIC_PURPOSE'
      ],
      default: 'HIGHWAYS_ROADS'
    },
    requiringAgency: {
      type: String,
      required: true,
      trim: true
    },
    agencyContactEmail: String,
    state: {
      type: String,
      required: true,
      index: true
    },
    districts: [
      {
        type: String,
        required: true,
        index: true
      }
    ],
    status: {
      type: String,
      enum: [
        'PROPOSAL_SUBMITTED',
        'SIA_INITIATED',
        'SIA_APPROVED',
        'SECTION_11_PUBLISHED',
        'OBJECTIONS_HEARING',
        'SECTION_19_DECLARED',
        'VALUATION_IN_PROGRESS',
        'AWARD_PRONOUNCED',
        'DISBURSEMENT_POSSESSION',
        'COMPLETED',
        'LITIGATION_STAYED'
      ],
      default: 'PROPOSAL_SUBMITTED',
      index: true
    },
    totalAreaRequiredHectares: {
      type: Number,
      required: true
    },
    estimatedBudgetINR: {
      type: Number,
      required: true
    },
    disbursedBudgetINR: {
      type: Number,
      default: 0
    },
    beneficiaryCount: {
      type: Number,
      default: 0
    },
    parcelsCount: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW'
    },
    milestones: [milestoneSchema],
    assignedCollector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAgencyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ state: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
