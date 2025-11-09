// src/pages/Admin/AssignTask.jsx
import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import PageContainer from "../../components/PageContainer";

const AssignTask = () => {
  const [notifications, setNotifications] = useState([]);

  // Request browser notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for incoming notifications (optional: for testing)
    socket.on("receiveNotification", (data) => {
      console.log("Notification received:", data);
      setNotifications((prev) => [data, ...prev]);

      if (Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.message,
          icon: "/icon.png", // optional icon
        });
      }
    });

    // Cleanup
    return () => socket.off("receiveNotification");
  }, []);

  // Function to send notification to Labour dashboard
  const handleAssign = () => {
    const notificationData = {
      title: "New Task",
      message: "You have a new order!",
      role: "labour", // target dashboard
    };

    socket.emit("sendNotification", notificationData);
    alert("Notification sent to Labour!");

    // Optionally add to local notifications list
    setNotifications((prev) => [notificationData, ...prev]);
  };

  return (
    <PageContainer>
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Task</h1>
      <button
        onClick={handleAssign}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Assign Task
      </button>

      {/* Notification dropdown */}
      {notifications.length > 0 && (
        <div className="mt-4 max-w-sm bg-white shadow-md rounded p-2 border">
          <h2 className="font-semibold mb-2">Notifications</h2>
          {notifications.map((n, i) => (
            <div key={i} className="border-b py-1">
              <b>{n.title}</b>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageContainer>
  );
};

export default AssignTask;
