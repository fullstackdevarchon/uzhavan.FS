import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export const joinRoom = (user) => {
  socket.emit("joinRoom", user);
};

export const sendNotification = (payload) => {
  socket.emit("sendNotification", payload);
};
