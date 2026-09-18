const mongoose = require('mongoose');

const compensationSchema = new mongoose.Schema(
  {
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcel',
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
    beneficiaryAadhaarHash: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      verified: { type: Boolean, default: false }
    },
    // RFCTLARR Schedule I Calculation Breakdown
    baseMarketValuePerAcre: {
      type: Number,
      required: true
    },
    acquiredAreaAcres: {
      type: Number,
      required: true
    },
    basicLandValue: {
      type: Number,
      required: true
    },
    multiplicationFactor: {
      type: Number,
      default: 1.0 // 1.0 for urban, up to 2.0 for rural
    },
    multipliedLandValue: {
      type: Number,
      required: true
    },
    assetsValueStructures: {
      type: Number,
      default: 0
    },
    assetsValueTreesCrops: {
      type: Number,
      default: 0
    },
    totalBaseAssetAndLandValue: {
      type: Number,
      required: true
    },
    solatiumPercentage: {
      type: Number,
      default: 100 // RFCTLARR Sec 30(1) mandates 100% Solatium
    },
    solatiumAmount: {
      type: Number,
      required: true
    },
    interest12PercentAdditionalValue: {
      type: Number,
      default: 0 // Sec 30(3) 12% per annum from Sec 11 to award date
    },
    interestDays: {
      type: Number,
      default: 0
    },
    totalGrossAwardINR: {
      type: Number,
      required: true
    },
    disbursementStatus: {
      type: String,
      enum: ['ESTIMATED', 'AWARD_APPROVED', 'ESCROW_FUNDED', 'DISBURSED', 'ON_HOLD_DISPUTE'],
      default: 'ESTIMATED',
      index: true
    },
    disbursedDate: Date,
    transactionReference: String,
    calculatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Compensation', compensationSchema);
