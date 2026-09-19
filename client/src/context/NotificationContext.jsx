import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api/apiClient';

export const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif_1',
    title: 'Statutory 12-Month Alert',
    message: 'Pune-Nashik Rail Corridor (MRIDC-PUNE-NSK-002) is nearing Section 19 declaration lapse window.',
    type: 'DELAY_RADAR_WARNING',
    severity: 'CRITICAL',
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    _id: 'notif_2',
    title: 'Award Approved',
    message: 'Statutory valuation award for Survey #142/1A has been sanctioned. Total: ₹2,93,66,506',
    type: 'PAYMENT_DISBURSED',
    severity: 'SUCCESS',
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    _id: 'notif_3',
    title: 'New Requisition Submitted',
    message: 'Talegaon Industrial Extension proposal submitted by MIDC.',
    type: 'ALERT',
    severity: 'INFO',
    createdAt: new Date().toISOString(),
    isRead: true
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(2);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data?.data && res.data.data.length > 0) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.data.filter((n) => !n.isRead).length);
      }
    } catch (e) {
      // Fallback to initial state
    }
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch (e) {
      // Offline fallback
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
