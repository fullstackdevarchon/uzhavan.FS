// src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const NotificationBell = ({ role }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", role); // join role room

    socket.on("receiveNotification", (data) => {
      setNotifications(prev => [data, ...prev]);
      showBrowserNotification(data.title, data.message);
    });

    return () => socket.off("receiveNotification");
  }, [role]);

  const showBrowserNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message, icon: "/icon.png" });
    }
  };

  return (
    <div className="relative">
      <button className="p-2 bg-blue-600 text-white rounded-full">
        🔔 {notifications.length}
      </button>
      {notifications.length > 0 && (
        <div className="absolute top-10 right-0 bg-white shadow-lg p-2 rounded w-64 max-h-64 overflow-auto">
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
