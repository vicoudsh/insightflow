'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { getProjectDetails, ProjectDetails as ProjectDetailsType } from '@/lib/api'
import StacksTable from './StacksTable'
import RoadmapsTable from './RoadmapsTable'
import DatabaseSchemaViewer from './DatabaseSchemaViewer'

interface ProjectDetailsProps {
  projectId: string | null
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      loadProjectDetails(projectId)
    } else {
      setProjectDetails(null)
      setError(null)
    }
  }, [projectId])

  async function loadProjectDetails(id: string) {
    try {
      setLoading(true)
      setError(null)
      const details = await getProjectDetails(id)
      setProjectDetails(details)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project details')
      console.error('Error loading project details:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!projectId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-400 mb-2">
            Select a project
          </h2>
          <p className="text-gray-500">
            Choose a project from the left sidebar to view its details
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!projectDetails) {
    return null
  }

  const { project, stacks, roadmaps } = projectDetails

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      {/* Project Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600 mb-4">{project.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Status: <span className="font-medium">{project.status}</span></span>
          <span>Created: <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span></span>
        </div>
      </div>

      {/* Stacks Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Stacks</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <StacksTable stacks={stacks} />
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Roadmaps {roadmaps && roadmaps.length > 0 && `(${roadmaps.length})`}
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <RoadmapsTable roadmaps={roadmaps || []} />
        </div>
      </div>

      {/* Database Schema Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Schema</h2>
        <DatabaseSchemaViewer project={project} />
      </div>
    </div>
  )
}

