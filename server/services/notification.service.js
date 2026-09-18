const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Dispatch an in-app notification to a user or role
 */
const createNotification = async ({
  recipient = null,
  recipientRole = 'ALL',
  title,
  message,
  type = 'ALERT',
  severity = 'INFO',
  link = ''
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,
      title,
      message,
      type,
      severity,
      link
    });
    logger.info(`Notification dispatched: [${severity}] ${title}`);
    return notification;
  } catch (error) {
    logger.warn(`Failed to create notification: ${error.message}`);
    return null;
  }
};

module.exports = {
  createNotification
};
