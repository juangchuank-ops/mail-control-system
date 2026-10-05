import { clsx, type ClassValue } from 'clsx'

/** 合并 className（本项目不使用 tailwind-merge，冲突由书写顺序决定） */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
