/**
 * Error logging utility
 * - Logs to Sentry in production
 * - Logs to console in development
 */

interface ErrorContext {
  userId?: string
  tenantId?: string
  action?: string
  metadata?: Record<string, unknown>
}

/**
 * Log an error with appropriate context
 */
export function logError(error: Error, context: ErrorContext = {}) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // In production, log to Sentry
    // For now, we'll use console.error as a placeholder
    // In a real implementation, you would use Sentry.captureException()
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
    
    // TODO: Replace with actual Sentry logging
    // Sentry.captureException(error, {
    //   tags: {
    //     userId: context.userId,
    //     tenantId: context.tenantId,
    //     action: context.action,
    //   },
    //   extra: context.metadata,
    // })
  } else {
    // In development, use console.warn for better visibility
    console.warn('Development Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Log a warning message
 */
export function logWarning(message: string, context: ErrorContext = {}) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // In production, log to Sentry as a message
    console.warn('Production Warning:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    })
    
    // TODO: Replace with actual Sentry logging
    // Sentry.captureMessage(message, 'warning', {
    //   tags: {
    //     userId: context.userId,
    //     tenantId: context.tenantId,
    //     action: context.action,
    //   },
    //   extra: context.metadata,
    // })
  } else {
    // In development, use console.warn
    console.warn('Development Warning:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Log an info message
 */
export function logInfo(message: string, context: ErrorContext = {}) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // In production, log to Sentry as an info message
    console.info('Production Info:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    })
    
    // TODO: Replace with actual Sentry logging
    // Sentry.captureMessage(message, 'info', {
    //   tags: {
    //     userId: context.userId,
    //     tenantId: context.tenantId,
    //     action: context.action,
    //   },
    //   extra: context.metadata,
    // })
  } else {
    // In development, use console.info
    console.info('Development Info:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}
