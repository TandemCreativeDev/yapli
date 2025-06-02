"use client";

import { useEffect, useRef } from "react";
import Linkify from "linkify-react";
import LinkPreview from "./LinkPreview";

interface Message {
  id: string;
  alias: string;
  message: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-text opacity-70">
              No messages yet. Be the first to say hello!
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const urls = extractUrls(msg.message);
            
            return (
              <div
                key={msg.id}
                className="border-b border-border pb-3 last:border-b-0"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-semibold text-text text-sm">
                    {msg.alias}
                  </span>
                  <span className="text-xs text-text opacity-50">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
                <div className="text-text text-sm leading-relaxed">
                  <Linkify
                    options={{
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "text-yapli-teal hover:text-yapli-hover underline break-all",
                    }}
                  >
                    {msg.message}
                  </Linkify>
                </div>
                {urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {urls.map((url, index) => (
                      <LinkPreview key={`${msg.id}-${index}`} url={url} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

