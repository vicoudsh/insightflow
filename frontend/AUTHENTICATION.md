# Authentication Flow

## Overview

The frontend uses Supabase Auth for user authentication. After a user registers and logs in for the first time, the frontend automatically manages the user token for all subsequent API calls.

## User Flow

### First Time User (Registration)

1. **User registers**:
   - User enters email and password on the registration form
   - Frontend calls `supabase.auth.signUp()`
   - If email confirmation is **disabled** in Supabase:
     - User is automatically logged in
     - Session is created immediately
     - Token is stored in localStorage
     - User is redirected to the main app
   - If email confirmation is **enabled** in Supabase:
     - User receives a confirmation email
     - User clicks the confirmation link
     - User is redirected to `/auth/callback`
     - Code is exchanged for a session
     - Token is stored in localStorage
     - User is redirected to the main app

2. **User logs in for the first time**:
   - User enters email and password on the login form
   - Frontend calls `supabase.auth.signInWithPassword()`
   - Session is created
   - Token is automatically stored in localStorage
   - User is redirected to the main app

### Returning User (Login)

1. **User logs in**:
   - User enters email and password
   - Frontend calls `supabase.auth.signInWithPassword()`
   - Session is created
   - Token is automatically stored in localStorage
   - User is redirected to the main app

2. **Page refresh**:
   - Frontend checks for existing session on page load
   - If session exists, token is retrieved from Supabase session
   - Token is stored in localStorage if not already present
   - User remains logged in

## Token Management

### Automatic Token Storage

After successful login or registration:
1. Supabase creates a session with an access token
2. Frontend automatically stores the token in localStorage (`auth_token`)
3. Token is used for all API calls to the backend

### Token Refresh

- Supabase automatically refreshes tokens when they expire
- The frontend listens for auth state changes
- When a token is refreshed, it's automatically stored in localStorage
- No manual intervention required

### Token Usage

All API calls to the backend include the token in the Authorization header:
```typescript
Authorization: Bearer <access_token>
```

## Components

### LoginForm
- Email and password login
- Automatically stores token after successful login
- Handles errors and loading states

### RegisterForm
- Email and password registration
- Handles email confirmation flow
- Automatically logs in if email confirmation is disabled
- Shows confirmation message if email confirmation is required

### UserMenu
- Displays user email
- Sign out functionality
- Removes token from localStorage on sign out

## API Client

The API client (`src/lib/api.ts`) automatically:
1. Retrieves token from localStorage
2. Falls back to Supabase session if token is not in localStorage
3. Includes token in all API requests
4. Handles token refresh automatically

## Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Session Persistence

- Supabase stores the session in localStorage (default)
- Session persists across page refreshes
- Token is automatically retrieved on page load
- User remains logged in until they sign out or token expires

## Email Confirmation

### If Email Confirmation is Disabled

1. User registers
2. User is automatically logged in
3. Token is stored immediately
4. User can use the app right away

### If Email Confirmation is Enabled

1. User registers
2. User receives confirmation email
3. User clicks confirmation link
4. User is redirected to `/auth/callback`
5. Code is exchanged for session
6. Token is stored
7. User is redirected to the main app
8. User can now login and use the app

## Security

- Tokens are stored in localStorage (client-side only)
- Tokens are automatically refreshed when they expire
- Tokens are removed on sign out
- All API calls use HTTPS
- Tokens are never exposed in URLs

## Notes

- The frontend automatically manages tokens - no manual token input required
- Users only need to register/login once
- After first login, tokens are automatically managed
- Session persists across page refreshes
- Token refresh is automatic and transparent to the user



