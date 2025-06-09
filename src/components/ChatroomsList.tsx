import Link from "next/link";
import RoomCodeButton from "./RoomCodeButton";
import CopyUrlButton from "./CopyUrlButton";
import DeleteRoomButton from "./DeleteRoomButton";

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
          <span className="text-center py-4 text-gray-600 dark:text-gray-400">
            Loading chatrooms...
          </span>
        ) : chatrooms.length === 0 ? (
          <p className="text-center py-4 text-gray-600 dark:text-gray-400">
            You haven&apos;t created any chatrooms yet.
          </p>
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
                    <RoomCodeButton
                      code={room.roomUrl || room.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyRoomId(room);
                      }}
                      fullWidth
                    />
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <CopyUrlButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyRoomUrl(room);
                          }}
                          roomTitle={room.title}
                          fullWidth
                          showText
                        />
                      </div>
                      <DeleteRoomButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteRoom(room);
                        }}
                        roomTitle={room.title}
                      />
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
                    <RoomCodeButton
                      code={room.roomUrl || room.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyRoomId(room);
                      }}
                    />
                    <CopyUrlButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyRoomUrl(room);
                      }}
                      roomTitle={room.title}
                    />
                    <DeleteRoomButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteRoom(room);
                      }}
                      roomTitle={room.title}
                    />
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
