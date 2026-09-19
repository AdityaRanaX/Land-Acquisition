import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = (id) => {
    markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleReadAll = () => {
    markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-status-danger" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-status-success" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      default:
        return <Info className="w-4 h-4 text-status-info" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg bg-bistre/70 border border-chamoisee/40 hover:border-buff text-buff hover:text-white transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-danger text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-surface border border-chamoisee/30 rounded-2xl shadow-2xl p-0 z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="px-4 py-3 border-b border-chamoisee/20 bg-[#F6F2EA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-bistre">System Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-kobicha/15 text-kobicha font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                className="text-[11px] text-kobicha hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-chamoisee/15">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-buff/15 cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-buff/10' : ''
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold ${!n.isRead ? 'text-bistre' : 'text-text-muted'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-text-muted">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-tight line-clamp-2">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-kobicha hover:underline mt-1.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-kobicha shrink-0 mt-1" />}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-chamoisee/15 text-center bg-[#FDFBF7]">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-kobicha hover:underline block py-1"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
