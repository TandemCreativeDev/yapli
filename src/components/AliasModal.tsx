"use client";

import { useState } from "react";

interface AliasModalProps {
  onAliasSet: (alias: string) => void;
  error?: string | null;
  isOpen: boolean;
}

export default function AliasModal({
  onAliasSet,
  error,
  isOpen,
}: AliasModalProps) {
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim()) {
      onAliasSet(alias.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="alias"
              className="block text-sm font-medium text-text mb-2"
            >
              Enter your name to join the chat:
            </label>
            <input
              type="text"
              id="alias"
              name="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              autoComplete="nickname"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-yapli-teal text-text bg-card placeholder-gray-500 ${
                error ? "border-red-500" : "border-border"
              }`}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={!alias.trim()}
            className="w-full bg-yapli-teal text-black py-2 px-4 rounded-md hover:bg-yapli-hover focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

