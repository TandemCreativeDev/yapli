"use client";

import { useState } from "react";

interface AliasInputProps {
  onAliasSet: (alias: string) => void;
}

export default function AliasInput({ onAliasSet }: AliasInputProps) {
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim()) {
      onAliasSet(alias.trim());
    }
  };

  return (
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
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Your name"
          maxLength={50}
          autoComplete="off"
          className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-yapli-teal text-text bg-card placeholder-gray-500"
        />
      </div>
      <button
        type="submit"
        disabled={!alias.trim()}
        className="w-full bg-yapli-teal text-black py-2 px-4 rounded-md hover:bg-yapli-hover focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Join Chat
      </button>
    </form>
  );
}

