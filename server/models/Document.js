const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    docType: {
      type: String,
      enum: [
        'LAND_TITLE_DEED',
        'EXTRACT_7_12_ROR',
        'ENCUMBRANCE_CERTIFICATE',
        'AADHAAR_CARD',
        'PAN_CARD',
        'BANK_PASSBOOK',
        'CASTE_CERTIFICATE',
        'BPL_CARD',
        'SIA_STUDY_REPORT',
        'SECTION_11_GAZETTE',
        'SECTION_19_DECLARATION',
        'VALUATION_REPORT',
        'AWARD_NOTICE',
        'OTHER'
      ],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSizeKB: Number,
    mimeType: String,
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
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'AI_VERIFIED', 'OFFICER_APPROVED', 'REJECTED_MISMATCH'],
      default: 'PENDING',
      index: true
    },
    ocrExtractedData: {
      ownerName: String,
      surveyNumber: String,
      areaMatched: Boolean,
      extractedText: String,
      confidenceScore: Number
    },
    verificationRemarks: String,
    requestedAction: {
      type: String,
      enum: ['REQUEST_NEW_DOCUMENT', 'ESCALATE']
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', documentSchema);
