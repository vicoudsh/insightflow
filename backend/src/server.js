import app from './app.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Get base URL from environment (for logging)
const getBaseUrl = () => {
  return process.env.API_BASE_URL || process.env.SERVER_URL || `http://localhost:${PORT}`
}

const baseUrl = getBaseUrl()

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📦 Environment: ${NODE_ENV}`)
  console.log(`🌐 Base URL: ${baseUrl}`)
  console.log(`🔗 Health check: ${baseUrl}/health`)
  console.log(`📚 API documentation: ${baseUrl}/`)
  console.log(`📋 OpenAPI JSON: ${baseUrl}/.well-known/openapi.json`)
  console.log(`🤖 Plugin manifest: ${baseUrl}/.well-known/ai-plugin.json`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

