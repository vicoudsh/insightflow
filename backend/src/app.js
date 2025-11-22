import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'

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

// Get base URL from environment (defaults to localhost for development)
const getBaseUrl = () => {
  return process.env.API_BASE_URL || process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`
}

// Serve .well-known/ai-plugin.json for OpenAI plugin discovery (dynamic URL)
app.get('/.well-known/ai-plugin.json', async (req, res) => {
  try {
    const baseUrl = getBaseUrl()
    const pluginPath = join(__dirname, '..', '.well-known', 'ai-plugin.json')
    const data = await readFile(pluginPath, 'utf8')
    const plugin = JSON.parse(data)
    
    // Update API URL dynamically based on environment
    plugin.api.url = `${baseUrl}/.well-known/openapi.json`
    
    res.setHeader('Content-Type', 'application/json')
    res.json(plugin)
  } catch (error) {
    console.error('Error reading ai-plugin.json:', error)
    res.status(500).json({ error: 'Failed to load plugin manifest' })
  }
})

// Serve OpenAPI specification (YAML) - dynamic server URL
app.get('/.well-known/openapi.yaml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl()
    const yamlPath = join(__dirname, '..', '.well-known', 'openapi.yaml')
    const yamlContent = await readFile(yamlPath, 'utf8')
    
    // Replace server URLs dynamically
    const dynamicYaml = yamlContent
      .replace(/http:\/\/localhost:3001/g, baseUrl)
      .replace(/https:\/\/your-domain\.com/g, baseUrl)
    
    res.setHeader('Content-Type', 'text/yaml')
    res.send(dynamicYaml)
  } catch (error) {
    console.error('Error serving openapi.yaml:', error)
    res.status(500).json({ error: 'Failed to load OpenAPI schema' })
  }
})

// Serve OpenAPI specification (JSON) - preferred format (dynamic server URL)
app.get('/.well-known/openapi.json', async (req, res) => {
  try {
    const baseUrl = getBaseUrl()
    const jsonPath = join(__dirname, '..', '.well-known', 'openapi.json')
    const jsonContent = await readFile(jsonPath, 'utf8')
    const schema = JSON.parse(jsonContent)
    
    // Update server URLs dynamically
    schema.servers = [
      {
        url: baseUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ]
    
    res.setHeader('Content-Type', 'application/json')
    res.json(schema)
  } catch (error) {
    console.error('Error serving openapi.json:', error)
    res.status(500).json({ error: 'Failed to load OpenAPI schema' })
  }
})

// Also support /openapi.json as alternative path
app.get('/openapi.json', async (req, res) => {
  try {
    const baseUrl = getBaseUrl()
    const jsonPath = join(__dirname, '..', '.well-known', 'openapi.json')
    const jsonContent = await readFile(jsonPath, 'utf8')
    const schema = JSON.parse(jsonContent)
    
    // Update server URLs dynamically
    schema.servers = [
      {
        url: baseUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ]
    
    res.setHeader('Content-Type', 'application/json')
    res.json(schema)
  } catch (error) {
    console.error('Error serving openapi.json:', error)
    res.status(500).json({ error: 'Failed to load OpenAPI schema' })
  }
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

