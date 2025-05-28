"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import AliasInput from "@/components/AliasInput";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

interface Message {
  id: string;
  alias: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [alias, setAlias] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!alias || !socketRef.current?.connected) return;

    setLoading(true);
    try {
      // Send via API to persist in database
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alias, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
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
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Chat events
    socket.on("new-message", (message: Message) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("users-updated", (users: string[]) => {
      console.log("Active users updated:", users);
      setActiveUsers(users);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Load initial messages and set alias when user joins
  useEffect(() => {
    if (alias && isConnected) {
      // Load existing messages from database
      fetchMessages();

      // Set alias for presence tracking
      if (socketRef.current) {
        socketRef.current.emit("set-alias", alias);
      }
    }
  }, [alias, isConnected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Zest Chat</h1>
          <p className="text-gray-600 text-sm">Global chat room for everyone</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {alias ? `Welcome, ${alias}!` : "Join the conversation"}
              </h2>
              {alias && (
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm text-gray-600">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                  {activeUsers.length > 0 && (
                    <span className="text-sm text-gray-500">
                      • {activeUsers.length} online
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {!alias ? (
              <AliasInput onAliasSet={setAlias} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 space-y-4">
                  <MessageList messages={messages} />
                  <div className="border-t pt-4">
                    <MessageInput
                      onSendMessageAction={sendMessage}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Online Users ({activeUsers.length})
                    </h3>
                    <div className="space-y-2">
                      {activeUsers.length === 0 ? (
                        <p className="text-sm text-gray-500">No users online</p>
                      ) : (
                        activeUsers.map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-700">
                              {user}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
