const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
  aadhaarLastFour: String,
  isDependent: { type: Boolean, default: true }
});

const familySchema = new mongoose.Schema(
  {
    familyHeadName: {
      type: String,
      required: true,
      trim: true
    },
    aadhaarHash: String,
    phone: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    parcels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parcel'
      }
    ],
    socialCategory: {
      type: String,
      enum: ['GENERAL', 'OBC', 'SC', 'ST', 'EWS'],
      default: 'GENERAL'
    },
    isBPL: {
      type: Boolean,
      default: false
    },
    isVulnerable: {
      type: Boolean,
      default: false
    },
    isLivelihoodLost: {
      type: Boolean,
      default: false
    },
    livelihoodType: {
      type: String,
      enum: ['AGRICULTURE', 'TENANT_FARMER', 'LANDLESS_LABOURER', 'ARTISAN_COMMERCIAL', 'OTHER'],
      default: 'AGRICULTURE'
    },
    membersCount: {
      type: Number,
      default: 1
    },
    members: [memberSchema],
    residentialDisplacement: {
      type: Boolean,
      default: false
    },
    citizenUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

familySchema.index({ project: 1, familyHeadName: 1 });

module.exports = mongoose.model('Family', familySchema);
