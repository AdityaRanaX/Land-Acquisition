const express = require('express');
const router = express.Router();
const {
  getDocuments,
  uploadDocument,
  verifyDocument,
  updateDocumentStatus
} = require('../controllers/documents.controller');
const authenticate = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', getDocuments);
router.post('/', audit('UPLOAD_DOCUMENT', 'DOCUMENTS'), uploadDocument);
router.patch('/:id', audit('UPDATE_DOCUMENT_STATUS', 'DOCUMENTS'), updateDocumentStatus);
router.post('/:id/verify', audit('AI_VERIFY_DOCUMENT', 'DOCUMENTS'), verifyDocument);

module.exports = router;
