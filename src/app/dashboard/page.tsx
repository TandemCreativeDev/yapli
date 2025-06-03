"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Brand from "@/components/Brand";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import ConfirmationModal from "@/components/ConfirmationModal";
import RoomCreationForm from "@/components/RoomCreationForm";
import { copyRoomUrl, copyRoomId } from "@/lib/roomUtils";
import {
  fetchChatrooms,
  createRoom as createRoomApi,
  deleteRoom,
} from "@/lib/roomApi";
import { TrashIcon, LinkIcon } from "@heroicons/react/24/outline";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Chatroom | null>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await fetchChatrooms();
      setChatrooms(data);
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleDeleteClick = (room: Chatroom) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      await deleteRoom(roomToDelete);
      // Remove from local state
      setChatrooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
      setShowDeleteModal(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      alert("Failed to delete chatroom. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  const handleCreateRoom = async (title: string) => {
    setCreatingRoom(true);
    try {
      await createRoomApi(title);
      // Refresh the chatrooms list
      await fetchRooms();
      // Hide the form
      setShowRoomForm(false);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleCancelCreateRoom = () => {
    setShowRoomForm(false);
  };

  // Load chatrooms on component mount
  useEffect(() => {
    if (session) {
      fetchRooms();
    }
  }, [session]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Stacked */}
          <div className="block sm:hidden space-y-4">
            {/* Brand Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-mono bg-yapli-teal bg-clip-text text-transparent">
                  yapli
                </h1>
                <Logo size={32} className="mt-2" />
              </div>
              <ThemeToggle />
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <p className="text-text opacity-70 text-sm">
                Create and join chat rooms
              </p>
              <div className="flex items-center gap-2">
                {session?.user && (
                  <>
                    <button
                      onClick={() => setShowRoomForm(!showRoomForm)}
                      className="relative overflow-hidden px-3 py-2 bg-gradient-to-r from-[#3EBDC7] to-blue-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7bcad9] before:to-blue-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                      aria-label={
                        showRoomForm
                          ? "Cancel room creation"
                          : "Create new chat room"
                      }
                    >
                      <span className="relative z-10">+ Create Room</span>
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white text-sm rounded-md cursor-pointer transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <Brand />
              <p className="text-text opacity-70 text-sm mt-2">
                Create and join chat rooms
              </p>
            </div>
            <div className="flex items-center gap-3">
              {session?.user && (
                <>
                  <span>
                    Welcome, {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => setShowRoomForm(true)}
                    className="relative overflow-hidden px-4 py-2 bg-yapli-teal text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-yapli-hover"
                    aria-label="Create new chat room"
                  >
                    <span className="relative z-10">+ Create New Room</span>
                  </button>
                  <div className="flex items-center gap-3 text-sm text-text">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="px-3 py-2 bg-red-500 hover:bg-red-400 text-white text-sm rounded-md cursor-pointer transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showRoomForm && (
          <RoomCreationForm
            onSubmit={handleCreateRoom}
            onCancel={handleCancelCreateRoom}
            isLoading={creatingRoom}
          />
        )}

        {/* Chatrooms List */}
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Chatrooms
            </h2>
          </div>
          <div className="p-4">
            {loadingRooms ? (
              <div className="text-center py-4">
                <div className="text-gray-600 dark:text-gray-400">
                  Loading chatrooms...
                </div>
              </div>
            ) : chatrooms.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-600 dark:text-gray-400">
                  You haven&apos;t created any chatrooms yet.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chatrooms.map((room) => (
                  <div
                    key={room.id}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {/* Mobile Layout - Stacked */}
                    <div className="block sm:hidden">
                      <Link
                        href={`/${room.roomUrl || room.id}`}
                        className="block mb-3"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {room.title}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {room._count.messages} messages • Created{" "}
                          {new Date(room.createdAt).toLocaleDateString()}
                        </div>
                      </Link>
                      <div className="flex flex-col space-y-2">
                        <div className="relative group">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyRoomId(room);
                            }}
                            className="w-full px-2 py-1 bg-gray-300 text-gray-700 rounded text-base font-mono hover:bg-gray-200 cursor-pointer transition-colors text-center"
                          >
                            {room.roomUrl || room.id}
                          </button>
                          <div className="absolute bottom-full mb-1 left-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Copy room code to clipboard
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative group flex-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyRoomUrl(room);
                              }}
                              className="w-full p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors flex items-center justify-center text-base"
                              aria-label={`Copy URL for ${room.title} chatroom`}
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Copy URL
                            </button>
                            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              Copy full URL to clipboard
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(room);
                            }}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-400 cursor-pointer transition-colors"
                            aria-label={`Delete ${room.title} chatroom`}
                            title="Delete room"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Original */}
                    <Link
                      href={`/${room.roomUrl || room.id}`}
                      className="hidden sm:flex items-center justify-start cursor-pointer"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 dark:text-white text-left">
                          {room.title}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                          {room._count.messages} messages • Created{" "}
                          {new Date(room.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 ml-auto">
                        <div className="relative group">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyRoomId(room);
                            }}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-base font-mono hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            {room.roomUrl || room.id}
                          </button>
                          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Copy room code to clipboard
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyRoomUrl(room);
                            }}
                            className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer transition-colors"
                            aria-label={`Copy URL for ${room.title} chatroom`}
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Copy full URL to clipboard
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(room);
                          }}
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer transition-colors"
                          aria-label={`Delete ${room.title} chatroom`}
                          title="Delete room"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Chatroom"
        message={`Are you sure you want to delete "${roomToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
