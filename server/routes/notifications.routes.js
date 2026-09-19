const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead } = require('../controllers/notifications.controller');
const authenticate = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;
