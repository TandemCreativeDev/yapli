"use client";

import { useState } from "react";

interface MessageInputProps {
  onSendMessageAction: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessageAction,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessageAction(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        maxLength={1000}
        disabled={disabled}
        autoComplete="off"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Send
      </button>
    </form>
  );
}

