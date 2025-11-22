'use client'

import { useState, useEffect } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { removeAuthToken } from '@/lib/api'

interface UserMenuProps {
  onSignOut: () => void
}

export default function UserMenu({ onSignOut }: UserMenuProps) {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      removeAuthToken()
      onSignOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-300 truncate flex-1 text-left">
          {user.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors rounded-b-lg"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

