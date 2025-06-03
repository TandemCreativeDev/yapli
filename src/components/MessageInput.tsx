"use client";

import { useState, useRef, memo, useEffect } from "react";

interface MessageInputProps {
  onSendMessageAction: (message: string) => void;
  disabled?: boolean;
}

function MessageInput({
  onSendMessageAction,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [shouldRefocus, setShouldRefocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      setShouldRefocus(true);
      onSendMessageAction(message.trim());
      setMessage("");
    }
  };

  // Refocus when disabled becomes false and we should refocus
  useEffect(() => {
    if (shouldRefocus && !disabled) {
      inputRef.current?.focus();
      setShouldRefocus(false);
    }
  }, [disabled, shouldRefocus]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        maxLength={1000}
        disabled={disabled}
        autoComplete="off"
        className="flex-1 px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-yapli-teal disabled:opacity-50 disabled:cursor-not-allowed text-text bg-card placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-yapli-teal text-black px-4 py-2 rounded-md hover:bg-yapli-hover focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Send
      </button>
    </form>
  );
}

export default memo(MessageInput, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled && 
         prevProps.onSendMessageAction === nextProps.onSendMessageAction;
});
