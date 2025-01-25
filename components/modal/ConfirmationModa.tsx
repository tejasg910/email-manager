'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfirmationContextType = {
  askConfirmation: (message: string, callback: () => void) => void
}

const ConfirmationContext = createContext<ConfirmationContextType>({
  askConfirmation: () => {}
})

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [callback, setCallback] = useState<(() => void) | null>(null)

  // Use useCallback to memoize the function
  const askConfirmation = useCallback((msg: string, cb: () => void) => {
    setMessage(msg)
    setCallback(() => cb)
    setIsOpen(true)
  }, [])

  // Memoize the context value
  const contextValue = useMemo(() => ({
    askConfirmation
  }), [askConfirmation])

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600">{message}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                callback?.()
                setIsOpen(false)
              }}
              className='bg-red-500 hover:bg-red-700'
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = () => useContext(ConfirmationContext)