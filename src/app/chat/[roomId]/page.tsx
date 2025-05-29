"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import AliasInput from "@/components/AliasInput";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

interface Message {
  id: string;
  chatroomId: string;
  alias: string;
  message: string;
  timestamp: string;
}

interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [alias, setAlias] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchChatroom = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setChatroom(data);
      } else if (response.status === 404) {
        setError("Chatroom not found");
      } else {
        setError("Failed to load chatroom");
      }
    } catch (error) {
      console.error("Error fetching chatroom:", error);
      setError("Failed to load chatroom");
    }
  }, [roomId]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [roomId]);

  const sendMessage = async (message: string) => {
    if (!alias || !socketRef.current?.connected) return;

    setLoading(true);
    try {
      // Send via API to persist in database
      const response = await fetch(`/api/rooms/${roomId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alias, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Also emit to WebSocket for real-time updates
      if (socketRef.current) {
        socketRef.current.emit("send-message", {
          roomId,
          alias,
          message,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Socket.io connection and event handling
  useEffect(() => {
    // Initialize socket connection
    const socket = io();
    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);

      // Join the specific room
      socket.emit("join-room", roomId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Chat events
    socket.on("new-message", (message: Message) => {
      console.log("New message received:", message);
      // Only add messages for this room
      if (message.chatroomId === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("users-updated", (users: string[]) => {
      console.log("Active users updated:", users);
      setActiveUsers(users);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Load initial data when component mounts
  useEffect(() => {
    fetchChatroom();
    fetchMessages();
  }, [fetchChatroom, fetchMessages]);

  // Set alias for presence tracking when user joins
  useEffect(() => {
    if (alias && isConnected && socketRef.current) {
      socketRef.current.emit("set-alias", alias);
    }
  }, [alias, isConnected]);

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error}</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-gray-100 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {chatroom.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Created {new Date(chatroom.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => router.push("/")}
                className="px-3 bg-yellow-500 py-3 text-sm text-black hover:bg-yellow-400 cursor-pointer rounded-lg"
              >
                ← Leave Room
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">
                {alias ? `Welcome, ${alias}!` : "Join the conversation"}
              </h2>
              {alias && (
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm text-gray-300">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                  {activeUsers.length > 0 && (
                    <span className="text-sm text-gray-400">
                      • {activeUsers.length} online
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 space-y-4">
                <MessageList messages={messages} />
                <div className="border-t pt-4">
                  <MessageInput
                    onSendMessageAction={sendMessage}
                    disabled={loading || !alias}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-semibold text-text mb-3">
                    Online Users ({activeUsers.length})
                  </h3>
                  <div className="space-y-2">
                    {activeUsers.length === 0 ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">No users online</p>
                    ) : (
                      activeUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-text">{user}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal overlay for alias input */}
          {!alias && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <AliasInput onAliasSet={setAlias} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Logo />
    </div>
  );
}
