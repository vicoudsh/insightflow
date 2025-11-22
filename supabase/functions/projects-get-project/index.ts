import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Parse request body to get project ID
    const body = await req.json()
    const { projectId } = body

    // Validate required fields
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Project ID is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Get project - verify it belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ 
          error: 'Project not found or access denied',
          details: projectError?.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      )
    }

    // Get stacks for the project
    const { data: stacks, error: stacksError } = await supabase
      .from('stacks')
      .select('*')
      .eq('project_id', projectId)

    if (stacksError) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch stacks', 
          details: stacksError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Get roadmaps with tasks and subtasks for the project
    const { data: roadmaps, error: roadmapsError } = await supabase
      .from('roadmaps')
      .select('*, tasks(*, subtasks(*))')
      .eq('project_id', projectId)

    if (roadmapsError) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch roadmaps', 
          details: roadmapsError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Combine all data
    const result = {
      success: true,
      data: {
        project,
        stacks: stacks || [],
        roadmaps: roadmaps || [],
      },
      message: 'Project retrieved successfully'
    }

    // Stringify the result for easy frontend use
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

