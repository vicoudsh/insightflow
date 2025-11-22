'use client'

import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function ChatInput({ onSend, placeholder = 'Type your message...', disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 120 // max-height in pixels
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [message])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3 bg-gray-900 flex-shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-3 py-2 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto"
            style={{
              minHeight: '40px',
              maxHeight: '120px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  )
}

