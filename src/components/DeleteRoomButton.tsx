import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteRoomButtonProps {
  onClick: (e: React.MouseEvent) => void;
  roomTitle: string;
}

export default function DeleteRoomButton({ onClick, roomTitle }: DeleteRoomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer transition-colors"
      aria-label={`Delete ${roomTitle} chatroom`}
      title="Delete room"
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  );
}