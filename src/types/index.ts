export interface NewsEvent {
  id: string
  title: string
  location: {
    name: string
    coord: [number, number]
    region: string
  }
  category: 'geopolitics' | 'economy' | 'natural' | 'corporate' | 'tech'
  impact: {
    market: string
    direction: 'up' | 'down'
    severity: 1 | 2 | 3
  }
  description: string
  timestamp: Date
  isLive: boolean
  isDomestic: boolean
  sourceUrl?: string
  sourceName?: string
}

export type EventCategory = NewsEvent['category']
export type NewsScope = 'domestic' | 'international' | 'all'