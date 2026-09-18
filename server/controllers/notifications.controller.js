const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

// @desc Get current user notifications
// @route GET /api/notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipient: req.user._id },
        { recipientRole: 'ALL' },
        { recipientRole: req.user.role }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(30);

    return ApiResponse.success(res, notifications, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return ApiResponse.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead
};
