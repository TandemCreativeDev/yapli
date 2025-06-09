import { useState } from "react";

interface RoomCreationFormProps {
  onSubmit: (title: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RoomCreationForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: RoomCreationFormProps) {
  const [roomTitle, setRoomTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;

    await onSubmit(roomTitle.trim());
    setRoomTitle("");
  };

  const handleCancel = () => {
    setRoomTitle("");
    onCancel();
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text">Create New Room</h2>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="roomTitle"
              className="block text-sm font-medium text-text mb-2"
            >
              Room Title
            </label>
            <input
              type="text"
              id="roomTitle"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="Enter a title for your room..."
              className="text-text bg-card w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
              disabled={isLoading}
              aria-busy={isLoading}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading || !roomTitle.trim()}
              className="px-4 py-2 bg-yapli-teal text-black rounded-md hover:bg-yapli-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Creating..." : "Create Room"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-card border border-border text-text rounded-md hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

