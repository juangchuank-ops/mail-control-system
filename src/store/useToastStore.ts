import { create } from 'zustand'

/**
 * 系统提示（Toast）——工业提示条，非气泡。
 * 自动过期由 ToastViewport 统一按时间戳回收，避免遗留定时器。
 */

export type ToastTone = 'default' | 'signal' | 'ok' | 'danger'

export interface ToastItem {
  id: string
  title: string
  detail?: string
  tone: ToastTone
  createdAt: number
}

export interface ToastInput {
  title: string
  detail?: string
  tone?: ToastTone
}

interface ToastState {
  toasts: ToastItem[]
  push: (input: ToastInput) => string
  dismiss: (id: string) => void
  clear: () => void
}

let toastSequence = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (input) => {
    toastSequence += 1
    const id = `toast-${Date.now().toString(36)}-${toastSequence}`
    const item: ToastItem = {
      id,
      title: input.title,
      detail: input.detail,
      tone: input.tone ?? 'default',
      createdAt: Date.now(),
    }
    set({ toasts: [...get().toasts, item].slice(-4) })
    return id
  },

  dismiss: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
  },

  clear: () => {
    set({ toasts: [] })
  },
}))
