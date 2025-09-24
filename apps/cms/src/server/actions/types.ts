/**
 * Common types for server actions
 */

export interface ActionResult<T = unknown> {
  ok: boolean
  data?: T
  errors?: Record<string, string[]>
  message?: string
}

export interface ActionError {
  field: string
  message: string
}

export type ActionResponse<T = unknown> = ActionResult<T>

/**
 * Helper function to create a successful action result
 */
export function createSuccessResult<T>(data: T, message?: string): ActionResult<T> {
  return {
    ok: true,
    data,
    message,
  }
}

/**
 * Helper function to create an error action result
 */
export function createErrorResult<T = unknown>(
  errors: Record<string, string[]> | ActionError[],
  message?: string
): ActionResult<T> {
  // Convert array of errors to object format if needed
  const errorObject = Array.isArray(errors)
    ? errors.reduce((acc, error) => {
        if (!acc[error.field]) {
          acc[error.field] = []
        }
        acc[error.field].push(error.message)
        return acc
      }, {} as Record<string, string[]>)
    : errors

  return {
    ok: false,
    errors: errorObject,
    message,
  }
}

/**
 * Helper function to create a validation error result
 */
export function createValidationErrorResult<T = unknown>(
  field: string,
  message: string,
  additionalMessage?: string
): ActionResult<T> {
  return createErrorResult([{ field, message }], additionalMessage)
}
