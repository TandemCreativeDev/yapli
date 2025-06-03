"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import AliasInput from "@/components/AliasInput";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

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
  userId?: string;
}

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function ChatRoomPage() {
  const params = useParams();
  const { data: session } = useSession();
  const roomId = params.roomId as string;

  const [alias, setAlias] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState<string | null>(null);
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

  const sendMessage = useCallback(async (message: string) => {
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
  }, [alias, roomId]);

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

    socket.on("alias-rejected", (data: { reason: string }) => {
      console.log("Alias rejected:", data.reason);
      setAliasError(data.reason);
      setAlias(null); // Reset alias to show the input again
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex items-center gap-0 mb-10">
          <h1 className="text-5xl font-bold font-mono bg-yapli-teal bg-clip-text text-transparent pb-2">
            yapli
          </h1>

          <Image
            src="/images/yapli-logo.png"
            alt="Zest Logo"
            width={60}
            height={60}
            className="rounded-lg"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">{error}</h1>
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="bg-card shadow-sm border-b border-border flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 min-h-12">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/images/yapli-logo.png"
                  alt="Yapli Logo"
                  width={32}
                  height={32}
                  className="rounded-lg sm:w-10 sm:h-10"
                />
                <h1 className="text-base sm:text-lg font-bold font-mono bg-yapli-teal bg-clip-text text-transparent">
                  yapli
                </h1>
              </div>
              <div className="hidden sm:block border-l border-border h-8 flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-text truncate">
                  {chatroom.title}
                </h2>
                <p className="text-text opacity-70 text-xs sm:text-sm hidden sm:block">
                  Created {new Date(chatroom.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {session?.user &&
                chatroom?.userId === (session.user as ExtendedUser).id && (
                  <Link
                    href="/dashboard"
                    className="px-3 py-1.5 text-xs sm:text-sm bg-yapli-teal hover:bg-yapli-hover text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Status Bar */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-medium text-text">
              {alias ? `Welcome, ${alias}!` : "Join the conversation"}
            </h2>
            {alias && (
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                />
                <span className="text-xs sm:text-sm text-text">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
                {activeUsers.length > 0 && (
                  <span className="text-xs sm:text-sm text-text opacity-70">
                    • {activeUsers.length} online
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area - Flexible */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-8">
              <div className="flex-1 min-h-0 py-4">
                <MessageList messages={messages} />
              </div>

              {/* Message Input - Sticky at bottom */}
              <div className="flex-shrink-0 py-4 border-t border-border bg-background">
                <MessageInput
                  onSendMessageAction={sendMessage}
                  disabled={loading || !alias}
                />
              </div>
            </div>

            {/* Users Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0 border-l border-border">
              <div className="p-4 h-full">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-semibold text-text mb-3">
                    Online Users ({activeUsers.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {activeUsers.length === 0 ? (
                      <p className="text-sm text-text opacity-70">
                        No users online
                      </p>
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
        </div>
      </main>

      {/* Modal overlay for alias input */}
      {!alias && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <AliasInput
              onAliasSet={(newAlias) => {
                setAliasError(null); // Clear error when setting new alias
                setAlias(newAlias);
              }}
              error={aliasError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
