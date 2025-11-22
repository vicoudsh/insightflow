/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Supabase error
  if (err.code && err.message) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message,
      code: err.code,
    })
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message,
      details: err.details,
    })
  }

  // Default error
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

/**
 * 404 Not Found handler
 */
export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
}

