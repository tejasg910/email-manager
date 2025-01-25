import { toast, ToastOptions, ToastPosition } from "react-toastify"
import { Bounce } from "react-toastify"

const DEFAULT_TOAST_CONFIG: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
progress:undefined, 
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
}

export const useToast = () => {
  const success = (message: string, emoji: string = '') => {
    toast.success(`${emoji} ${message}`, {
      ...DEFAULT_TOAST_CONFIG,
    })
  }

  const error = (message: string, emoji: string = '') => {
    toast.error(`${emoji} ${message}`, {
      ...DEFAULT_TOAST_CONFIG,
    })
  }

  const warn = (message: string, emoji: string = '') => {
    toast.warn(`${emoji} ${message}`, {
      ...DEFAULT_TOAST_CONFIG,
    })
  }

  return { success, error, warn }
}