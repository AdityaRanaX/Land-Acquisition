const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument, verifyDocument } = require('../controllers/documents.controller');
const authenticate = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.use(authenticate);

router.get('/', getDocuments);
router.post('/', audit('UPLOAD_DOCUMENT', 'DOCUMENTS'), uploadDocument);
router.post('/:id/verify', audit('AI_VERIFY_DOCUMENT', 'DOCUMENTS'), verifyDocument);

module.exports = router;
