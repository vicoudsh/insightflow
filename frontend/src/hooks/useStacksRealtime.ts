/**
 * Hook to subscribe to Supabase Realtime changes on the stacks table
 * Refreshes stacks when INSERT, UPDATE, or DELETE events occur
 */

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseStacksRealtimeOptions {
  projectId: string | null
  onStacksChange: () => void
  enabled?: boolean
}

export function useStacksRealtime({
  projectId,
  onStacksChange,
  enabled = true,
}: UseStacksRealtimeOptions) {
  useEffect(() => {
    if (!projectId || !enabled) {
      return
    }

    // Create a channel for stacks changes filtered by project_id
    const channel: RealtimeChannel = supabase
      .channel(`stacks:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'stacks',
          filter: `project_id=eq.${projectId}`, // Filter by project_id
        },
        (payload) => {
          console.log('Stacks Realtime event:', payload.eventType, payload)
          
          // Refresh stacks when any change occurs
          onStacksChange()
        }
      )
      .subscribe((status) => {
        console.log('Stacks Realtime subscription status:', status)
        
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to stacks changes for project ${projectId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to stacks changes')
        }
      })

    // Cleanup: unsubscribe when component unmounts or projectId changes
    return () => {
      console.log(`Unsubscribing from stacks changes for project ${projectId}`)
      supabase.removeChannel(channel)
    }
  }, [projectId, onStacksChange, enabled])
}

