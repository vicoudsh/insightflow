'use client'

import { AlertCircle, Key } from 'lucide-react'
import { useState } from 'react'
import { setAuthToken } from '@/lib/api'

interface AuthPromptProps {
  onAuthSuccess: () => void
}

export default function AuthPrompt({ onAuthSuccess }: AuthPromptProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token.trim()) {
      setError('Please enter a valid token')
      return
    }

    try {
      setAuthToken(token.trim())
      setError(null)
      onAuthSuccess()
    } catch (err) {
      setError('Failed to set auth token')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Authentication Required</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Please enter your Supabase authentication token to access the application.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Auth Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Supabase auth token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Authenticate
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Get your token from Supabase Auth after logging in to your account.
        </p>
      </div>
    </div>
  )
}



