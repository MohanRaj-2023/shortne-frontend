// hooks/useNotificationSocket.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateUnreadNotificationCount } from "../Actions/NotificationActions";

const useNotificationsocket = (token) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      console.warn("❌ No token. WebSocket not initialized.");
      return;
    }

    if (socketRef.current) {
      console.log("🟡 WebSocket already active. Skipping init.");
      return;
    }

    const socket = new WebSocket(`wss://shortne-backend.onrender.com/ws/notifications/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Notification WebSocket connected-------.");
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "NEW_NOTIFICATION" || data.type === "NOTIFICATION_COUNT_UPDATE") {
        dispatch(updateUnreadNotificationCount(data.unread_notifications));
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket closed.");
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token]);
};

export default useNotificationsocket;
