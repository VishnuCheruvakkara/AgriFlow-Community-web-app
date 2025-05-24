import { useEffect } from "react";

const useWebSocketNotification = (token) => {
    useEffect(() => {
        if (!token) {
            console.warn("No token found, skipping WebSocket connection.");
            return;
        }

        const socket = new WebSocket(
            `ws://localhost:8000/ws/notification/user/`,
            token  // Sending token as subprotocol
        );

        socket.onopen = () => {
            console.log(" WebSocket connection opened");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(" Notification received:", data);
            // Handle your notification logic here (e.g., Redux dispatch or toast)
        };

        socket.onerror = (error) => {
            console.error(" WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log("WebSocket closed:", event.code, event.reason);
        };

        return () => {
            socket.close();
        };
    }, [token]);
};

export default useWebSocketNotification;
