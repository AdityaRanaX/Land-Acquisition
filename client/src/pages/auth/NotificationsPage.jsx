import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

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
        return <AlertTriangle className="w-5 h-5 text-status-danger" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-status-success" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-status-warning" />;
      default:
        return <Info className="w-5 h-5 text-status-info" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">System Notifications & Statutory Alerts</h2>
          <p className="text-xs text-text-muted">Real-time statutory lapse warnings, disbursement updates, and hearing schedules</p>
        </div>
        <Button variant="outline" icon={CheckCheck} onClick={handleReadAll}>
          Mark All as Read
        </Button>
      </div>

      <Card title="All Notifications Feed">
        <div className="divide-y divide-chamoisee/15">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-4 transition-colors ${
                !n.isRead ? 'bg-buff/10' : 'bg-surface'
              }`}
            >
              <div className="mt-0.5 shrink-0">{getSeverityIcon(n.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${!n.isRead ? 'text-bistre' : 'text-text-muted'}`}>
                    {n.title}
                  </h4>
                  <span className="text-xs text-text-muted">
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  {n.link && (
                    <Link
                      to={n.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-kobicha hover:underline"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => handleRead(n.id)}
                      className="text-xs text-text-muted hover:text-bistre underline cursor-pointer"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
