'use client'

interface ChatMessageProps {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'
  const isAssistant = role === 'assistant'
  const isSystem = role === 'system'

  return (
    <div
      className={`flex flex-col gap-1.5 px-3 py-2 rounded-lg ${
        isUser
          ? 'bg-blue-600/20 border border-blue-600/30'
          : isAssistant
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-gray-700/50 border border-gray-600'
      } ${isSystem ? 'border-l-4 border-l-gray-500' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isUser ? 'text-blue-400' : isAssistant ? 'text-green-400' : 'text-gray-400'
          }`}
        >
          {isUser ? 'You' : isAssistant ? 'Assistant' : 'System'}
        </span>
        {timestamp && (
          <span className="text-xs text-gray-500">{timestamp}</span>
        )}
      </div>
      <div className="text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
        {content}
      </div>
    </div>
  )
}

