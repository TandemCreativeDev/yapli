import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  chatroomId: string;
  alias: string;
  message: string;
  timestamp: string;
}

interface UseSocketOptions {
  roomId: string;
  onNewMessage: (message: Message) => void;
  onUsersUpdated: (users: string[]) => void;
  onAliasRejected: (reason: string) => void;
}

export function useSocket({ roomId, onNewMessage, onUsersUpdated, onAliasRejected }: UseSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  
  // Use refs to store latest callback functions to avoid dependency issues
  const callbacksRef = useRef({ onNewMessage, onUsersUpdated, onAliasRejected });
  callbacksRef.current = { onNewMessage, onUsersUpdated, onAliasRejected };

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);
      socket.emit("join-room", roomId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("new-message", (message: Message) => {
      console.log("New message received:", message);
      if (message.chatroomId === roomId) {
        callbacksRef.current.onNewMessage(message);
      }
    });

    socket.on("users-updated", (users: string[]) => {
      console.log("Active users updated:", users);
      callbacksRef.current.onUsersUpdated(users);
    });

    socket.on("alias-rejected", (data: { reason: string }) => {
      console.log("Alias rejected:", data.reason);
      callbacksRef.current.onAliasRejected(data.reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const setAlias = useCallback((alias: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("set-alias", alias);
    }
  }, [isConnected]);

  const emitMessage = useCallback((alias: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send-message", {
        roomId,
        alias,
        message,
      });
    }
  }, [roomId]);

  return {
    isConnected,
    setAlias,
    emitMessage,
  };
}