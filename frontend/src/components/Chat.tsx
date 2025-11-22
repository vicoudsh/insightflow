'use client'

import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

interface ChatProps {
  messages?: Message[]
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function Chat({ messages = [], onSend, placeholder, disabled = false }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  function handleSend(message: string) {
    if (onSend) {
      onSend(message)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Discussion Feed */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center px-4">
              <p className="text-gray-400">No messages yet</p>
              <p className="text-xs text-gray-600 mt-1">Start a conversation below</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Prompt Input */}
      <ChatInput
        onSend={handleSend}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

