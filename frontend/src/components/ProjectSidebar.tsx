'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Folder, Loader2 } from 'lucide-react'
import { getProjects, Project } from '@/lib/api'
import UserMenu from './UserMenu'

interface ProjectSidebarProps {
  selectedProjectId: string | null
  onProjectSelect: (projectId: string) => void
  onSignOut: () => void
}

export default function ProjectSidebar({
  selectedProjectId,
  onProjectSelect,
  onSignOut,
}: ProjectSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      setError(null)
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (isCollapsed) {
    return (
      <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col items-center justify-center p-2 w-12">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col w-64">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Projects
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="p-4 text-gray-400 text-sm text-center">
            No projects found
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{project.name}</div>
                {project.description && (
                  <div className="text-xs mt-1 opacity-75 line-clamp-1">
                    {project.description}
                  </div>
                )}
                <div className="text-xs mt-1 opacity-60">
                  {project.status}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer - User Menu */}
      <div className="p-4 border-t border-gray-800">
        <UserMenu onSignOut={onSignOut} />
      </div>
    </div>
  )
}

