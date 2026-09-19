import React, { useState } from 'react';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CitizenCard, CitizenPageHeader } from '../../components/citizen/CitizenCard';
import { citizenNotifications as initialNotifications } from '../../data/citizenMockData';

export const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markRead = (id) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  const markAllRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));

  return (
    <div className="citizen-page">
      <CitizenPageHeader title="Notifications" subtitle="Updates about your land acquisition case.">
        {unreadCount > 0 && <Button variant="outline" icon={CheckCheck} onClick={markAllRead}>Mark all as read</Button>}
      </CitizenPageHeader>
      <CitizenCard title="Case Updates" subtitle={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}>
        <div className="citizen-notification-list">
          {notifications.map((notification) => (
            <button className={`citizen-notification-row ${notification.read ? '' : 'is-unread'}`} key={notification.id} onClick={() => markRead(notification.id)}>
              <span className="citizen-notification-icon"><Bell size={17} /></span>
              <span className="citizen-notification-copy"><strong>{notification.title}</strong><span>{notification.description}</span><small>{notification.date}</small></span>
              {!notification.read && <Circle className="citizen-unread-dot" size={10} fill="currentColor" />}
            </button>
          ))}
        </div>
      </CitizenCard>
    </div>
  );
};

export default Notifications;
