"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  _count: {
    messages: number;
  };
}

export default function Home() {
  const router = useRouter();
  const [alias, setAlias] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/rooms/global-chat/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChatrooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await fetch("/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setChatrooms(data);
      }
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const deleteChatroom = async (roomId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this chatroom? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setChatrooms((prev) => prev.filter((room) => room.id !== roomId));
      } else {
        throw new Error("Failed to delete chatroom");
      }
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      alert("Failed to delete chatroom. Please try again.");
    }
  };

  const sendMessage = async (message: string) => {
    if (!alias || !socketRef.current?.connected) return;

    setLoading(true);
    try {
      // Send via API to persist in database
      const response = await fetch("/api/rooms/global-chat/messages", {
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
          roomId: "global-chat",
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

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;

    setCreatingRoom(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: roomTitle.trim() }),
      });

      if (response.ok) {
        const { roomId } = await response.json();
        // Refresh the chatrooms list
        await fetchChatrooms();
        router.push(`/chat/${roomId}`);
      } else {
        throw new Error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(false);
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

      // Join the global chat room
      socket.emit("join-room", "global-chat");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Chat events
    socket.on("new-message", (message: any) => {
      console.log("New message received:", message);
      // Only add messages for the global chat
      if (message.chatroomId === "global-chat") {
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

  // Load chatrooms on component mount
  useEffect(() => {
    fetchChatrooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zest Chat</h1>
              <p className="text-gray-600 text-sm">
                Global chat room for everyone
              </p>
            </div>
            <button
              onClick={() => setShowRoomForm(!showRoomForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              + Create New Room
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showRoomForm && (
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Room
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={createRoom} className="space-y-4">
                <div>
                  <label
                    htmlFor="roomTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Room Title
                  </label>
                  <input
                    type="text"
                    id="roomTitle"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    placeholder="Enter a title for your room..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={creatingRoom}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creatingRoom || !roomTitle.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingRoom ? "Creating..." : "Create Room"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomForm(false);
                      setRoomTitle("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chatrooms List */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Chatrooms
            </h2>
          </div>
          <div className="p-4">
            {loadingRooms ? (
              <div className="text-center py-4">
                <div className="text-gray-500">Loading chatrooms...</div>
              </div>
            ) : chatrooms.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-500">
                  No chatrooms available. Create one to get started!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chatrooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {room.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {room._count.messages} messages • Created{" "}
                        {new Date(room.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/chat/${room.id}`)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => deleteChatroom(room.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
