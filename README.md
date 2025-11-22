# InsightFlow

Project Management Platform with Model Context Protocol (MCP) Server support.

## Overview

InsightFlow is a full-stack project management platform that enables AI-powered project management through MCP (Model Context Protocol) integration. It provides comprehensive CRUD operations for projects, stacks, roadmaps, tasks, and subtasks.

## Architecture

- **Backend**: Express.js REST API with MCP server endpoints
- **Frontend**: Next.js React application
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Edge Functions**: Supabase Edge Functions for MCP handler and OpenAPI schema

## Features

- ✅ Full CRUD operations for projects, stacks, roadmaps, tasks, subtasks
- ✅ MCP (Model Context Protocol) server for AI integration
- ✅ OpenAPI 3.1.0 schema in JSON format
- ✅ Row Level Security (RLS) for data isolation
- ✅ Authentication via Supabase Auth
- ✅ Real-time database updates
- ✅ Modern React UI with Next.js

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Supabase account and project

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

### Database Setup

```bash
cd supabase
supabase db push
```

## Project Structure

```
insightflow/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   └── .well-known/ # OpenAPI schema
├── frontend/         # Next.js React app
│   └── src/
│       ├── app/      # Next.js app router
│       ├── components/
│       └── lib/
└── supabase/         # Supabase configuration
    ├── functions/    # Edge Functions
    └── migrations/   # Database migrations
```

## API Endpoints

### REST API (`/api/*`)
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

Similar endpoints for stacks, roadmaps, tasks, subtasks.

### MCP Tools (`/mcp/*`)
- `GET /mcp/tools` - List available MCP tools
- `POST /mcp/projects/list` - List projects (MCP)
- `POST /mcp/projects/create` - Create project (MCP)
- And more...

## OpenAPI Schema

The OpenAPI schema is available at:
- JSON: `/.well-known/openapi.json`
- YAML: `/.well-known/openapi.yaml`

## Documentation

- [Backend API Documentation](backend/API_DOCUMENTATION.md)
- [MCP Documentation](backend/MCP_DOCUMENTATION.md)
- [Quick Start Guide](QUICKSTART.md)
- [Environment Setup](ENV_SETUP.md)

## License

MIT

