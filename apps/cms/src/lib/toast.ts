import { toast } from "sonner"

export const toastHelpers = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    })
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    })
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },
}

// Common toast messages for the CMS
export const cmsToasts = {
  // Direct toast methods (for convenience)
  success: (message: string, description?: string) => toastHelpers.success(message, description),
  error: (message: string, description?: string) => toastHelpers.error(message, description),
  info: (message: string, description?: string) => toastHelpers.info(message, description),
  warning: (message: string, description?: string) => toastHelpers.warning(message, description),
  loading: (message: string) => toastHelpers.loading(message),
  dismiss: (toastId?: string | number) => toastHelpers.dismiss(toastId),
  
  // Content management
  contentSaved: () => toastHelpers.success("Content saved", "Your changes have been saved as a draft"),
  contentPublished: () => toastHelpers.success("Content published", "Your content is now live on the site"),
  contentScheduled: (date: string) => toastHelpers.success("Content scheduled", `Will be published on ${date}`),
  contentDeleted: () => toastHelpers.success("Content deleted", "The item has been removed"),
  
  // Media management
  mediaUploaded: (filename: string) => toastHelpers.success("Media uploaded", `${filename} has been added to your library`),
  mediaDeleted: (filename: string) => toastHelpers.success("Media deleted", `${filename} has been removed`),
  mediaError: (error: string) => toastHelpers.error("Upload failed", error),
  
  // Settings
  settingsSaved: () => toastHelpers.success("Settings saved", "Your preferences have been updated"),
  settingsError: () => toastHelpers.error("Settings error", "Failed to save your settings"),
  
  // General errors
  networkError: () => toastHelpers.error("Network error", "Please check your connection and try again"),
  unexpectedError: () => toastHelpers.error("Something went wrong", "Please try again or contact support"),
  
  // Validation
  validationError: (field: string) => toastHelpers.warning("Validation error", `Please check the ${field} field`),
  requiredField: (field: string) => toastHelpers.warning("Required field", `${field} is required`),
  
  // Loading states
  saving: () => toastHelpers.loading("Saving..."),
  publishing: () => toastHelpers.loading("Publishing..."),
  uploading: () => toastHelpers.loading("Uploading..."),
  loadingContent: () => toastHelpers.loading("Loading..."),
}
