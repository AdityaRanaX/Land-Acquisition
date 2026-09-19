const Document = require('../models/Document');
const Project = require('../models/Project');
const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');
const { verifyDocumentMismatch } = require('../services/docVerify.service');

// @desc Get list of documents
// @route GET /api/documents
const getDocuments = async (req, res, next) => {
  try {
    const { parcelId, projectId, status, docType } = req.query;
    const filter = {};

    if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const [projects, parcels] = await Promise.all([
        Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id'),
        Parcel.find({ state: req.user.jurisdiction?.state, district: req.user.jurisdiction?.district }).select('_id')
      ]);
      filter.$or = [
        { project: { $in: projects.map((project) => project._id) } },
        { parcel: { $in: parcels.map((parcel) => parcel._id) } }
      ];
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      const projects = await Project.find({ state: req.user.jurisdiction.state }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'REQUIRING_AGENCY' && req.user.jurisdiction?.agencyName) {
      const projects = await Project.find({ requiringAgency: req.user.jurisdiction.agencyName }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'CITIZEN') {
      filter.uploadedBy = req.user._id;
    }

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
      doc.verificationStatus = 'OFFICER_APPROVED';
      doc.requestedAction = undefined;
      doc.verifiedBy = req.user._id;
      doc.verifiedAt = new Date();
    } else if (action === 'REJECT') {
      doc.verificationStatus = 'REJECTED_MISMATCH';
      doc.requestedAction = undefined;
      doc.verifiedBy = req.user._id;
      doc.verifiedAt = new Date();
    } else if (action === 'REQUEST_NEW_DOCUMENT') {
      doc.verificationStatus = 'PENDING';
      doc.requestedAction = 'REQUEST_NEW_DOCUMENT';
    } else if (action === 'ESCALATE') {
      doc.verificationStatus = 'REJECTED_MISMATCH';
      doc.requestedAction = 'ESCALATE';
    } else if (status) {
      doc.verificationStatus = status;
    }

    if (remarks) doc.verificationRemarks = remarks;
    if (mismatchFlags) doc.verificationRemarks = `${doc.verificationRemarks || ''} Mismatch flags: ${JSON.stringify(mismatchFlags)}`.trim();
    if (action !== 'REQUEST_NEW_DOCUMENT' && action !== 'ESCALATE') doc.requestedAction = undefined;

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
