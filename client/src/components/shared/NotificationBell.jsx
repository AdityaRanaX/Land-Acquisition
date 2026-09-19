import React, { useState, useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationBell = ({ onOpen, citizen = false }) => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => onOpen ? onOpen() : setOpen(!open)}
        className={`relative p-2 transition-colors ${citizen ? 'citizen-notification-button' : 'rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'}`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 glass-panel bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-0 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No alerts found</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/40 cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-sky-500/5' : ''
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-1" />}
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
