'use client'

import { useState, useEffect } from 'react'
import ProjectSidebar from '@/components/ProjectSidebar'
import ProjectDetails from '@/components/ProjectDetails'
import RightSidebar from '@/components/RightSidebar'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import { supabase } from '@/lib/supabase'
import { setAuthToken } from '@/lib/api'

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Store token for API calls
        if (session.access_token) {
          setAuthToken(session.access_token)
        }
        setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Store token for API calls
        if (session.access_token) {
          setAuthToken(session.access_token)
        }
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  function handleAuthSuccess() {
    setIsAuthenticated(true)
  }

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        {showRegister ? (
          <RegisterForm
            onAuthSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onAuthSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    )
  }

  function handleSignOut() {
    setIsAuthenticated(false)
    setSelectedProjectId(null)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Left Sidebar - Projects List */}
      <ProjectSidebar
        selectedProjectId={selectedProjectId}
        onProjectSelect={setSelectedProjectId}
        onSignOut={handleSignOut}
      />

      {/* Main Content - Project Details */}
      <ProjectDetails projectId={selectedProjectId} />

      {/* Right Sidebar - Empty for now */}
      <RightSidebar />
    </div>
  )
}
