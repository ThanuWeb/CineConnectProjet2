import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getToken } from "../api";

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
