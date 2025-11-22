import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import REST API routes
import projectsRoutes from './routes/projects.js'
import stacksRoutes from './routes/stacks.js'
import roadmapsRoutes from './routes/roadmaps.js'
import tasksRoutes from './routes/tasks.js'
import subtasksRoutes from './routes/subtasks.js'

// Import MCP routes
import mcpRoutes from './routes/mcp/index.js'

// Import error handlers
import { errorHandler, notFound } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// Serve .well-known/ai-plugin.json for OpenAI plugin discovery
app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.sendFile(join(__dirname, '..', '.well-known', 'ai-plugin.json'))
})

// Serve OpenAPI specification (YAML)
app.get('/.well-known/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml')
  res.sendFile(join(__dirname, '..', '.well-known', 'openapi.yaml'))
})

// Serve OpenAPI specification (JSON) - preferred format
app.get('/.well-known/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.sendFile(join(__dirname, '..', '.well-known', 'openapi.json'))
})

// Also support /openapi.json as alternative path
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.sendFile(join(__dirname, '..', '.well-known', 'openapi.json'))
})

// REST API routes
app.use('/api/projects', projectsRoutes)
app.use('/api/stacks', stacksRoutes)
app.use('/api/roadmaps', (req, res, next) => {
  console.log('🚀 [APP.JS] Roadmaps route hit:', req.method, req.url)
  console.log('🚀 [APP.JS] Query params:', req.query)
  next()
}, roadmapsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/subtasks', subtasksRoutes)

// MCP routes (for AI tools)
app.use('/mcp', mcpRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'InsightFlow Backend API',
    version: '1.0.0',
    routes: {
      api: {
        description: 'REST API endpoints for frontend applications',
        endpoints: {
          projects: '/api/projects',
          stacks: '/api/stacks',
          roadmaps: '/api/roadmaps',
          tasks: '/api/tasks',
          subtasks: '/api/subtasks',
        },
      },
      mcp: {
        description: 'MCP (Model Context Protocol) tools for AI applications',
        endpoints: {
          tools: '/mcp/tools',
          projects: '/mcp/projects/*',
          stacks: '/mcp/stacks/*',
          roadmaps: '/mcp/roadmaps/*',
          tasks: '/mcp/tasks/*',
          subtasks: '/mcp/subtasks/*',
        },
      },
    },
  })
})

// 404 handler
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

export default app

