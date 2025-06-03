import Link from "next/link";
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

interface ChatroomsListProps {
  chatrooms: Chatroom[];
  isLoading: boolean;
  handleCopyRoomUrl: (room: Chatroom) => void;
  handleCopyRoomId: (room: Chatroom) => void;
  handleDeleteRoom: (room: Chatroom) => void;
}

export default function ChatroomsList({
  chatrooms,
  isLoading,
  handleCopyRoomUrl,
  handleCopyRoomId,
  handleDeleteRoom,
}: ChatroomsListProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Active Chatrooms
        </h2>
      </div>
      <div className="p-4">
        {isLoading ? (
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
                          handleCopyRoomId(room);
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
                            handleCopyRoomUrl(room);
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
                          handleDeleteRoom(room);
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
                          handleCopyRoomId(room);
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
                          handleCopyRoomUrl(room);
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
                        handleDeleteRoom(room);
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
  );
}
