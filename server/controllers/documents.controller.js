const Document = require('../models/Document');
const ApiResponse = require('../utils/apiResponse');
const { verifyDocumentMismatch } = require('../services/docVerify.service');

// @desc Get list of documents
// @route GET /api/documents
const getDocuments = async (req, res, next) => {
  try {
    const { parcelId, projectId, status, docType } = req.query;
    const filter = {};

    if (parcelId) filter.parcel = parcelId;
    if (projectId) filter.project = projectId;
    if (status) filter.verificationStatus = status;
    if (docType) filter.docType = docType;

    const docs = await Document.find(filter)
      .populate('uploadedBy', 'name email role')
      .populate('parcel', 'surveyNumber village primaryOwnerName')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, docs, 'Documents retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Upload new document record
// @route POST /api/documents
const uploadDocument = async (req, res, next) => {
  try {
    const { title, docType, fileUrl, project, parcel, ocrExtractedData } = req.body;

    const doc = await Document.create({
      title,
      docType,
      fileUrl: fileUrl || 'https://placehold.co/600x800.png?text=Land+Deed+Scanned',
      project,
      parcel,
      uploadedBy: req.user._id,
      ocrExtractedData
    });

    return ApiResponse.created(res, doc, 'Document record created');
  } catch (error) {
    next(error);
  }
};

// @desc Run Smart AI/OCR Verification check
// @route POST /api/documents/:id/verify
const verifyDocument = async (req, res, next) => {
  try {
    const result = await verifyDocumentMismatch(req.params.id);
    return ApiResponse.success(res, result, 'Document verification processed');
  } catch (error) {
    next(error);
  }
};

// @desc Update document verification status (Accept, Reject, Request new doc, Escalate)
// @route PATCH /api/documents/:id
const updateDocumentStatus = async (req, res, next) => {
  try {
    const { status, action, remarks, mismatchFlags } = req.body;
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return ApiResponse.notFound(res, 'Document not found');
    }

    if (action === 'ACCEPT') {
      doc.verificationStatus = 'VERIFIED';
    } else if (action === 'REJECT') {
      doc.verificationStatus = 'REJECTED';
    } else if (action === 'REQUEST_NEW_DOCUMENT') {
      doc.verificationStatus = 'PENDING';
    } else if (action === 'ESCALATE') {
      doc.verificationStatus = 'FLAGGED_DISCREPANCY';
    } else if (status) {
      doc.verificationStatus = status;
    }

    if (remarks) doc.verificationNotes = remarks;
    if (mismatchFlags) doc.mismatchFlags = mismatchFlags;

    await doc.save();

    return ApiResponse.success(res, doc, 'Document status updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  uploadDocument,
  verifyDocument,
  updateDocumentStatus
};
