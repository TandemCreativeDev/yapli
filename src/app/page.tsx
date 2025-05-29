"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Chatroom {
  id: string;
  roomUrl?: string;
  title: string;
  createdAt: string;
  _count: {
    messages: number;
  };
}

export default function Home() {
  const router = useRouter();
  const [roomTitle, setRoomTitle] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

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

  const deleteChatroom = async (room: Chatroom) => {
    if (
      !confirm(
        "Are you sure you want to delete this chatroom? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // Use roomUrl if available, otherwise fall back to id
      const identifier = room.roomUrl || room.id;
      const response = await fetch(`/api/rooms/${identifier}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setChatrooms((prev) => prev.filter((r) => r.id !== room.id));
      } else {
        throw new Error("Failed to delete chatroom");
      }
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      alert("Failed to delete chatroom. Please try again.");
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
        const { roomUrl } = await response.json();
        // Refresh the chatrooms list
        await fetchChatrooms();
        router.push(`/chat/${roomUrl}`);
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

  // Load chatrooms on component mount
  useEffect(() => {
    fetchChatrooms();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-gray-100 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-6">
                <h1 className="text-5xl font-bold text-yellow-500">Zest</h1>

                <Image
                  src="/images/zest-logo.png"
                  alt="Zest Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Create and join chat rooms
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setShowRoomForm(!showRoomForm)}
                className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 text-sm font-medium cursor-pointer"
              >
                + Create New Room
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showRoomForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Room
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={createRoom} className="space-y-4">
                <div>
                  <label
                    htmlFor="roomTitle"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Room Title
                  </label>
                  <input
                    type="text"
                    id="roomTitle"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    placeholder="Enter a title for your room..."
                    className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                    disabled={creatingRoom}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creatingRoom || !roomTitle.trim()}
                    className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {creatingRoom ? "Creating..." : "Create Room"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomForm(false);
                      setRoomTitle("");
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chatrooms List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Chatrooms
            </h2>
          </div>
          <div className="p-4">
            {loadingRooms ? (
              <div className="text-center py-4">
                <div className="text-gray-600 dark:text-gray-400">Loading chatrooms...</div>
              </div>
            ) : chatrooms.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-600 dark:text-gray-400">
                  No chatrooms available. Create one to get started!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chatrooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{room.title}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {room._count.messages} messages • Created{" "}
                        {new Date(room.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/chat/${room.roomUrl || room.id}`)}
                        className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-md hover:bg-yellow-400 cursor-pointer"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => deleteChatroom(room)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-400 cursor-pointer transition-colors"
                        title="Delete room"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Logo />
    </div>
  );
}
