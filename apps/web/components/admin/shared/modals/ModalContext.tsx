'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface ModalConfig {
  id: string
  component: React.ComponentType<{ onClose: () => void }>
  props?: Record<string, unknown>
}

export interface ModalState {
  modals: ModalConfig[]
}

export interface ModalContextValue {
  openModal: (config: ModalConfig) => void
  closeModal: (id?: string) => void
  closeAllModals: () => void
  isModalOpen: (id: string) => boolean
  activeModalCount: number
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}

interface ModalProviderProps {
  children: ReactNode
  maxModals?: number
}

export function ModalProvider({ children, maxModals = 2 }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalConfig[]>([])

  const openModal = useCallback((config: ModalConfig) => {
    setModals((prev) => {
      // Check if modal with same id already exists
      if (prev.some((m) => m.id === config.id)) {
        return prev
      }

      // Enforce max modal limit
      if (prev.length >= maxModals) {
        console.warn(`Maximum modal limit (${maxModals}) reached`)
        return prev
      }

      return [...prev, config]
    })
  }, [maxModals])

  const closeModal = useCallback((id?: string) => {
    setModals((prev) => {
      if (id) {
        return prev.filter((m) => m.id !== id)
      }
      // Close the topmost modal if no id provided
      return prev.slice(0, -1)
    })
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  const isModalOpen = useCallback((id: string) => {
    return modals.some((m) => m.id === id)
  }, [modals])

  const value: ModalContextValue = {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    activeModalCount: modals.length,
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal) => {
        const ModalComponent = modal.component
        return (
          <ModalComponent
            key={modal.id}
            onClose={() => closeModal(modal.id)}
            {...(modal.props || {})}
          />
        )
      })}
    </ModalContext.Provider>
  )
}
