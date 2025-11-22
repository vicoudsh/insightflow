import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

/**
 * Authentication middleware
 * Verifies the Bearer token and attaches user and authenticated client to request
 */
export const authenticate = async (req, res, next) => {
  try {
    console.log('🔐 [AUTH MIDDLEWARE] Request received')
    console.log('🔐 [AUTH MIDDLEWARE] Method:', req.method)
    console.log('🔐 [AUTH MIDDLEWARE] URL:', req.url)
    console.log('🔐 [AUTH MIDDLEWARE] Path:', req.path)
    console.log('🔐 [AUTH MIDDLEWARE] Query:', JSON.stringify(req.query, null, 2))
    
    const authHeader = req.headers.authorization
    console.log('🔐 [AUTH MIDDLEWARE] Auth header present:', !!authHeader)
    console.log('🔐 [AUTH MIDDLEWARE] Auth header starts with Bearer:', authHeader?.startsWith('Bearer '))

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ [AUTH MIDDLEWARE] Missing or invalid authorization header')
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔐 [AUTH MIDDLEWARE] Token extracted, length:', token.length)
    console.log('🔐 [AUTH MIDDLEWARE] Token preview:', token.substring(0, 20) + '...')

    // Create a Supabase client with anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verify token and get user
    console.log('🔐 [AUTH MIDDLEWARE] Verifying token with Supabase...')
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('❌ [AUTH MIDDLEWARE] Token verification failed:', error?.message)
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        details: error?.message,
      })
    }

    console.log('✅ [AUTH MIDDLEWARE] Token verified, user ID:', user.id)
    console.log('✅ [AUTH MIDDLEWARE] User email:', user.email)

    // Create authenticated client for database operations
    // This client will use the JWT for RLS policies
    const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseAnonKey,
        },
      },
    })

    console.log('✅ [AUTH MIDDLEWARE] Authenticated Supabase client created')

    // Attach user and authenticated client to request
    req.user = user
    req.token = token
    req.supabase = authenticatedSupabase // Authenticated client with RLS

    console.log('✅ [AUTH MIDDLEWARE] Request authenticated, proceeding to route handler')
    next()
  } catch (error) {
    console.error('❌ [AUTH MIDDLEWARE] Authentication error:', error)
    console.error('❌ [AUTH MIDDLEWARE] Error stack:', error.stack)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to authenticate request',
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't fail if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      
      // Create a Supabase client
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const {
        data: { user },
      } = await supabase.auth.getUser(token)

      if (user) {
        // Create authenticated client
        const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: supabaseAnonKey,
            },
          },
        })
        
        req.user = user
        req.token = token
        req.supabase = authenticatedSupabase
      }
    }

    next()
  } catch (error) {
    // Continue without authentication if optional
    next()
  }
}

