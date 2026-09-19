import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../services/api/notificationApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Bell, CheckCircle2, RefreshCw, AlertCircle, Info, Check, ShieldAlert } from 'lucide-react';

export const DistrictNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationApi.getMyNotifications();
      setNotifications(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to retrieve notifications from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    setUpdatingId(id);
    try {
      const res = await notificationApi.markAsRead(id);
      if (res.data?.data) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isRead: true, readAt: new Date() } : item))
        );
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to mark notification as read');
    } finally {
      setUpdatingId(null);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="danger" dot>CRITICAL</Badge>;
      case 'WARNING':
        return <Badge variant="warning" dot>WARNING</Badge>;
      case 'SUCCESS':
        return <Badge variant="success" dot>SUCCESS</Badge>;
      default:
        return <Badge variant="default">INFO</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">District Notifications & Audit Feed</h1>
          <p className="text-xs text-[#6C625B]">Real-time administrative alerts, milestone updates, and statutory notices</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A2E1B] bg-[#F8F4ED] border border-[#DDD3C7] hover:bg-[#EAD8CE] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Backend Limitation Notice */}
      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B]">
        <strong>Backend Contract Notice:</strong> Single notification status updates are supported via <code>PUT /api/notifications/:id/read</code>. Bulk "mark all read" is not supported by the server API.
      </div>

      {error && (
        <div className="p-4 bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
          {error}
        </div>
      )}

      <Card title="Official Notifications Feed" subtitle="MongoDB Notifications Collection">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#6C625B]">Loading notifications feed...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#DDD3C7] rounded-xl bg-[#F8F4ED] space-y-2">
            <Bell className="w-8 h-8 text-[#C07D38] mx-auto opacity-70" />
            <p className="text-xs font-semibold text-[#4A2E1B]">No notifications found</p>
            <p className="text-[11px] text-[#6C625B]">There are currently no official notifications addressed to your district user or role.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  n.isRead ? 'bg-white border-[#DDD3C7] opacity-80' : 'bg-[#F8F4ED] border-[#C07D38]/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EAD8CE] text-[#B84D28] mt-0.5 flex-shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#4A2E1B]">{n.title}</h4>
                      {getSeverityBadge(n.severity)}
                      {!n.isRead && (
                        <span className="text-[10px] bg-[#B84D28] text-white px-1.5 py-0.2 rounded font-semibold uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6C625B] mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-[#6C625B] block mt-1.5 font-mono">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : 'Date N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!n.isRead ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={updatingId === n._id}
                      icon={Check}
                      onClick={() => handleMarkAsRead(n._id)}
                    >
                      Mark Read
                    </Button>
                  ) : (
                    <span className="text-xs text-[#6C625B] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C07D38]" /> Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DistrictNotifications;
