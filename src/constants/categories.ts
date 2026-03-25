import type { EventCategory } from '@/types'

export const categoryLabels: Record<EventCategory, string> = {
  geopolitics: '地缘政治',
  economy: '宏观经济',
  tech: '科技/AI',
  natural: '自然灾害',
  corporate: '企业动态'
}

export const categoryColors: Record<EventCategory, string> = {
  geopolitics: '#f56c6c',
  economy: '#409eff',
  tech: '#9c27b0',
  natural: '#67c23a',
  corporate: '#e6a23c'
}