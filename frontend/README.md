# InsightFlow Frontend

Next.js frontend application for InsightFlow project management.

## Features

- **User Authentication**: Register and login with Supabase Auth
- **Automatic Token Management**: Frontend automatically manages user tokens
- **Collapsible Left Sidebar**: Project list with selection
- **Main Content Area**: Displays selected project information
  - Stacks table (React Table)
  - Roadmaps table (React Table)
  - Database schema viewer
- **Collapsible Right Sidebar**: 30% width, empty for now (ready for future features)
- **User Menu**: Sign out functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://yoxuhgzmxmrzxzrxrlky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Authentication Flow

1. **Registration**: Users can register with email and password
2. **Email Confirmation**: If email confirmation is enabled in Supabase, users will receive a confirmation email
3. **Login**: After registration (or if already registered), users can login
4. **Automatic Token Management**: 
   - After successful login, the access token is automatically stored
   - Token is used for all API calls to the backend
   - Token is automatically refreshed when it expires
   - Token persists across page refreshes

## User Flow

1. **First Time User**:
   - Register with email and password
   - If email confirmation is required, check email and confirm
   - Login with credentials
   - Token is automatically stored and managed

2. **Returning User**:
   - Login with email and password
   - Token is automatically retrieved from Supabase session
   - No manual token input required

3. **Session Management**:
   - Token is stored in localStorage for API calls
   - Supabase manages the session and token refresh
   - User can sign out using the user menu

## Backend Connection

The frontend connects to the backend API running on `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL`).

Make sure the backend server is running before starting the frontend.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts      # Auth callback handler
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Main page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ProjectSidebar.tsx    # Left sidebar with project list
│   │   ├── ProjectDetails.tsx    # Main content area
│   │   ├── StacksTable.tsx       # Stacks table component
│   │   ├── RoadmapsTable.tsx     # Roadmaps table component
│   │   ├── DatabaseSchemaViewer.tsx # Database schema viewer
│   │   ├── RightSidebar.tsx      # Right sidebar
│   │   ├── LoginForm.tsx         # Login form
│   │   ├── RegisterForm.tsx      # Register form
│   │   └── UserMenu.tsx          # User menu with sign out
│   └── lib/
│       ├── api.ts                # API client
│       └── supabase.ts           # Supabase client
```

## Components

### LoginForm
- Email and password login
- Error handling
- Loading states
- Link to register form

### RegisterForm
- Email and password registration
- Password confirmation
- Email confirmation handling
- Link to login form

### UserMenu
- Displays user email
- Sign out functionality
- Dropdown menu

### ProjectSidebar
- Displays list of projects from the database
- Allows selecting a project
- Collapsible with toggle button
- User menu integration

### ProjectDetails
- Shows selected project information
- Displays stacks, roadmaps, and database schema
- Handles loading and error states

### StacksTable
- React Table component for displaying stacks
- Sortable columns
- Compact design

### RoadmapsTable
- React Table component for displaying roadmaps
- Shows task count for each roadmap
- Status badges
- Sortable columns

### DatabaseSchemaViewer
- Displays database schema from project
- Supports JSON schema format
- Compact card layout

### RightSidebar
- Collapsible right sidebar
- 30% width when expanded
- Empty for now, ready for future features

## Technologies

- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Table (@tanstack/react-table)**: Table components
- **Lucide React**: Icons
- **Supabase Auth**: Authentication

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Authentication Details

### Token Management

1. **Storage**: Tokens are stored in localStorage for API calls
2. **Refresh**: Supabase automatically refreshes tokens when they expire
3. **Session**: Supabase manages the session and persists it across page refreshes
4. **API Calls**: All API calls to the backend include the token in the Authorization header

### Email Confirmation

If email confirmation is enabled in Supabase:
1. User registers with email and password
2. User receives confirmation email
3. User clicks confirmation link
4. User is redirected back to the app
5. User can now login

If email confirmation is disabled:
1. User registers with email and password
2. User is automatically logged in
3. Token is stored immediately

## Notes

- The frontend requires the backend API to be running
- Authentication is handled via Supabase Auth
- All API requests are made to the backend REST API endpoints
- The application uses React Server Components where possible
- Client components are used for interactive features
- Token management is automatic - no manual token input required
