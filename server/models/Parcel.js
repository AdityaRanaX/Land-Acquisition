const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    surveyNumber: {
      type: String,
      required: true,
      trim: true
    },
    subDivisionNumber: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      required: true,
      index: true
    },
    district: {
      type: String,
      required: true,
      index: true
    },
    taluka: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    landType: {
      type: String,
      enum: ['AGRICULTURAL_IRRIGATED', 'AGRICULTURAL_UNIRRIGATED', 'RESIDENTIAL', 'COMMERCIAL', 'WASTELAND', 'FOREST', 'GOVERNMENT'],
      default: 'AGRICULTURAL_IRRIGATED'
    },
    urbanOrRural: {
      type: String,
      enum: ['URBAN', 'RURAL'],
      default: 'RURAL'
    },
    areaAcres: {
      type: Number,
      required: true
    },
    areaHectares: {
      type: Number,
      required: true
    },
    primaryOwnerName: {
      type: String,
      required: true,
      trim: true
    },
    primaryOwnerAadhaarHash: String,
    primaryOwnerPhone: String,
    citizenUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acquisitionStatus: {
      type: String,
      enum: [
        'IDENTIFIED',
        'NOTIFIED_SEC_11',
        'SURVEY_VERIFIED',
        'VALUATION_COMPLETED',
        'AWARD_PRONOUNCED',
        'COMPENSATION_PAID',
        'POSSESSION_TAKEN',
        'DISPUTED'
      ],
      default: 'IDENTIFIED',
      index: true
    },
    baseMarketRatePerAcreINR: {
      type: Number,
      default: 0
    },
    geometry: {
      type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon', 'Point'],
        default: 'Polygon'
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    },
    fieldVerification: {
      isVerified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date,
      groundPhotos: [String],
      fieldNotes: String,
      discrepancyDetected: { type: Boolean, default: false },
      discrepancyDetails: String
    }
  },
  {
    timestamps: true
  }
);

parcelSchema.index({ geometry: '2dsphere' });
parcelSchema.index({ surveyNumber: 1, village: 1, district: 1 });

module.exports = mongoose.model('Parcel', parcelSchema);
