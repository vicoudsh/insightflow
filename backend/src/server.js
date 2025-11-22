import app from './app.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📦 Environment: ${NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API documentation: http://localhost:${PORT}/`)
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

