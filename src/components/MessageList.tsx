'use client'

interface Message {
  id: string
  alias: string
  message: string
  timestamp: string
}

interface MessageListProps {
  messages: Message[]
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages yet. Be the first to say hello!
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="border-b border-gray-100 pb-3 last:border-b-0">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {msg.alias}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))
      )}
    </div>
  )
}