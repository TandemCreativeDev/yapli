'use client'

import { useState, useEffect } from 'react'
import AliasInput from '@/components/AliasInput'
import MessageList from '@/components/MessageList'
import MessageInput from '@/components/MessageInput'

interface Message {
  id: string
  alias: string
  message: string
  timestamp: string
}

export default function Home() {
  const [alias, setAlias] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!alias) return

    setLoading(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alias, message }),
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (alias) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [alias])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Zest Chat</h1>
          <p className="text-gray-600 text-sm">Global chat room for everyone</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {alias ? `Welcome, ${alias}!` : 'Join the conversation'}
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {!alias ? (
              <AliasInput onAliasSet={setAlias} />
            ) : (
              <>
                <MessageList messages={messages} />
                <div className="border-t pt-4">
                  <MessageInput onSendMessage={sendMessage} disabled={loading} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
