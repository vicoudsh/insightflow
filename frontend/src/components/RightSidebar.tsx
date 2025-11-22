'use client'

import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Chat from './Chat'
import type { Message } from './Chat'

interface RightSidebarProps {
  // Placeholder for future props
}

export default function RightSidebar({}: RightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  // Temporary mock messages for display - will be replaced with real logic later
  const [messages] = useState<Message[]>([])

  function handleSend(message: string) {
    // TODO: Add logic to send message
    console.log('Sending message:', message)
  }

  if (isCollapsed) {
    return (
      <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col items-center justify-center p-2 w-12">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Expand sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col w-[30%]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Chat</h2>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Collapse sidebar"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Chat Component */}
      <div className="flex-1 overflow-hidden">
        <Chat
          messages={messages}
          onSend={handleSend}
          placeholder="Ask about your project..."
        />
      </div>
    </div>
  )
}

