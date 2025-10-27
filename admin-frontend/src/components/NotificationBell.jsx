import React, { useState, useEffect } from "react";
import { joinRoom, onReceiveNotification, offReceiveNotification } from "../socket";

const NotificationBell = ({ role }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!role) return;

    // ✅ Join room only once
    joinRoom(role);

    const handleNotification = (data) => {
      setNotifications((prev) => [data, ...prev]);

      if (Notification.permission === "granted") {
        new Notification(data.title, { body: data.message, icon: "/icon.png" });
      }

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== data));
      }, 5000);
    };

    // ✅ Add listener
    onReceiveNotification(handleNotification);

    // ✅ Cleanup listener
    return () => offReceiveNotification();
  }, [role]);

  return (
    <div className="relative">
      <button className="p-2 bg-blue-600 text-white rounded-full">
        🔔 {notifications.length}
      </button>

      {notifications.length > 0 && (
        <div className="absolute top-12 right-0 bg-white shadow-lg p-2 rounded w-64 max-h-64 overflow-auto z-50">
          {notifications.map((n, i) => (
            <div key={i} className="border-b py-1">
              <b>{n.title}</b>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
