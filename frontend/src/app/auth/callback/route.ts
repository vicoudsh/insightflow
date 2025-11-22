import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    // Create a server-side Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      try {
        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Error exchanging code for session:', error)
          // Redirect to home with error
          return NextResponse.redirect(`${origin}?error=auth_failed`)
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        return NextResponse.redirect(`${origin}?error=auth_failed`)
      }
    }
  }

  // Redirect to home page after authentication
  return NextResponse.redirect(origin)
}

