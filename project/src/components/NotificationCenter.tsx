import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { format } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-gray-600 hover:text-gray-700 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(notification.createdAt), 'PPp')}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
