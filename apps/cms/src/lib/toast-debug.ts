import { toast } from "sonner"

// Simple debug version
export const debugToast = {
  success: (message: string, description?: string) => {
    console.log("Debug toast success called:", message, description)
    return toast.success(message, {
      description,
      duration: 4000,
    })
  },
  error: (message: string, description?: string) => {
    console.log("Debug toast error called:", message, description)
    return toast.error(message, {
      description,
      duration: 6000,
    })
  },
  info: (message: string, description?: string) => {
    console.log("Debug toast info called:", message, description)
    return toast.info(message, {
      description,
      duration: 4000,
    })
  },
  warning: (message: string, description?: string) => {
    console.log("Debug toast warning called:", message, description)
    return toast.warning(message, {
      description,
      duration: 5000,
    })
  }
}
