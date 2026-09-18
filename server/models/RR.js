const mongoose = require('mongoose');

const rrSchema = new mongoose.Schema(
  {
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      required: true,
      unique: true,
      index: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    beneficiaryName: {
      type: String,
      required: true
    },
    // RFCTLARR Second Schedule Elements
    houseConstructedOrProvided: {
      isEligible: { type: Boolean, default: false },
      optedCashInLieu: { type: Boolean, default: false },
      cashAmountINR: { type: Number, default: 0 },
      allottedPlotNumber: String,
      resettlementColonyLocation: String
    },
    oneTimeResettlementAllowanceINR: {
      type: Number,
      default: 50000 // Statutory standard
    },
    subsistenceGrantPerMonthINR: {
      type: Number,
      default: 3000 // Rs. 3000/mo for 12 months for displaced families
    },
    subsistencePeriodMonths: {
      type: Number,
      default: 12
    },
    transportationAllowanceINR: {
      type: Number,
      default: 50000
    },
    cattleShedPettyShopGrantINR: {
      type: Number,
      default: 25000
    },
    artisanGrantINR: {
      type: Number,
      default: 25000
    },
    skillDevelopmentTrainingOffered: {
      type: Boolean,
      default: true
    },
    mandatoryEmploymentOffered: {
      type: Boolean,
      default: false
    },
    totalRRAmountINR: {
      type: Number,
      required: true
    },
    deliveryStatus: {
      type: String,
      enum: ['DRAFT_PLAN', 'SIA_APPROVED', 'SANCTIONED', 'PARTIALLY_DELIVERED', 'FULLY_DELIVERED'],
      default: 'DRAFT_PLAN',
      index: true
    },
    sanctionedDate: Date,
    completedDate: Date,
    remarks: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RR', rrSchema);
