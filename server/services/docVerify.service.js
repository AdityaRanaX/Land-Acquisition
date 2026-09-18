const Document = require('../models/Document');
const Parcel = require('../models/Parcel');

/**
 * Simulates OCR text extraction and discrepancy check against survey/parcel record
 */
const verifyDocumentMismatch = async (documentId) => {
  const doc = await Document.findById(documentId).populate('parcel');
  if (!doc) throw new Error('Document not found');

  const parcel = doc.parcel;
  const simulatedConfidence = 0.94;

  let isDiscrepancy = false;
  let discrepancyDetails = '';

  if (parcel) {
    // Check simulated mismatch
    const docOwner = doc.ocrExtractedData?.ownerName || '';
    const parcelOwner = parcel.primaryOwnerName || '';

    if (docOwner && parcelOwner && !parcelOwner.toLowerCase().includes(docOwner.toLowerCase()) && !docOwner.toLowerCase().includes(parcelOwner.toLowerCase())) {
      isDiscrepancy = true;
      discrepancyDetails = `Owner name on document (${docOwner}) deviates from Revenue Record (${parcelOwner})`;
    }
  }

  doc.verificationStatus = isDiscrepancy ? 'REJECTED_MISMATCH' : 'AI_VERIFIED';
  doc.ocrExtractedData = {
    ...doc.ocrExtractedData,
    confidenceScore: simulatedConfidence,
    areaMatched: !isDiscrepancy
  };
  doc.verificationRemarks = isDiscrepancy
    ? `Automated verification flagged anomaly: ${discrepancyDetails}`
    : 'Automated verification passed. Coordinates and owner match Land Registry.';
  doc.verifiedAt = new Date();

  await doc.save();

  return {
    documentId: doc._id,
    status: doc.verificationStatus,
    confidence: simulatedConfidence,
    isDiscrepancy,
    discrepancyDetails,
    remarks: doc.verificationRemarks
  };
};

module.exports = {
  verifyDocumentMismatch
};
