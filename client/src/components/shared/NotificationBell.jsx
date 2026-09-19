import React, { useState, useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-[#B84D28]" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-[#6C625B]" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-[#C07D38]" />;
      default:
        return <Info className="w-4 h-4 text-[#6C625B]" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 border border-[#DDD3C7] hover:border-[#B84D28] text-[#6C625B] hover:text-[#B84D28] transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B84D28] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#F8F4ED] border border-[#DDD3C7] p-0 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#DDD3C7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#4A2E1B]">Notifications</h4>
              {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#EAD8CE] text-[#B84D28] font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                  className="text-[11px] text-[#B84D28] hover:text-[#4A2E1B] flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#DDD3C7]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6C625B]">No alerts found</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-[#EFE7DC] ${!n.isRead ? 'bg-[#FBF0EA]' : ''}`}
                >
                  <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${!n.isRead ? 'text-[#4A2E1B]' : 'text-[#6C625B]'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-[#6C625B]">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6C625B] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#B84D28] flex-shrink-0 mt-1" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
