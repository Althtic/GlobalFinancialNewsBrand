import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { NewsEvent, EventCategory, NewsScope } from '@/types'
import { fetchDomesticNews } from '@/services/newsService'
import { mockEvents } from '@/data/mockEvents'

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000
const API_BASE_URL = '/api'

export const useNewsStore = defineStore('news', () => {
  const events = ref<NewsEvent[]>([])
  const selectedCategory = ref<EventCategory | 'all'>('all')
  const newsScope = ref<NewsScope>('all')
  const selectedEvent = ref<NewsEvent | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredEvents = computed(() => {
    let filtered = events.value

    // Filter by scope (domestic/international)
    if (newsScope.value !== 'all') {
      filtered = filtered.filter(e => e.isDomestic === (newsScope.value === 'domestic'))
    }

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory.value)
    }

    // Filter to only show events from last 48 hours
    const now = Date.now()
    filtered = filtered.filter(e => {
      const age = now - e.timestamp.getTime()
      return age >= 0 && age <= FORTY_EIGHT_HOURS
    })

    // Sort by timestamp, newest first
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return filtered
  })

  const liveEvents = computed(() => events.value.filter(e => e.isLive))

  const stats = computed(() => {
    const now = Date.now()
    const last48h = events.value.filter(e => (now - e.timestamp.getTime()) <= FORTY_EIGHT_HOURS)
    return {
      total: last48h.length,
      geopolitics: last48h.filter(e => e.category === 'geopolitics').length,
      economy: last48h.filter(e => e.category === 'economy').length,
      tech: last48h.filter(e => e.category === 'tech').length,
      natural: last48h.filter(e => e.category === 'natural').length,
      corporate: last48h.filter(e => e.category === 'corporate').length,
    }
  })

  function selectEvent(event: NewsEvent | null) {
    selectedEvent.value = event
  }

  function setCategory(category: EventCategory | 'all') {
    selectedCategory.value = category
  }

  function setNewsScope(scope: NewsScope) {
    newsScope.value = scope
  }

  async function initializeEvents() {
    isLoading.value = true
    error.value = null

    // 先显示 mock 数据保证能看
    events.value = mockEvents

    // 同时尝试 RSS 获取最新新闻
    try {
      const rssNews = await fetchDomesticNews()
      if (rssNews.length > 0) {
        // 合并 RSS 数据，去重
        const existingIds = new Set(events.value.map(e => e.id))
        const newEvents = rssNews.filter(e => !existingIds.has(e.id))
        events.value = [...newEvents, ...events.value].slice(0, 100)
      }
    } catch (err) {
      console.warn('RSS fetch failed:', err)
    }

    // RSS 失败的话，API 就不尝试了，直接用 mock
    isLoading.value = false
  }

  async function refreshNews() {
    isLoading.value = true
    error.value = null

    // 先尝试 RSS
    try {
      const rssNews = await fetchDomesticNews()
      if (rssNews.length > 0) {
        // 合并新数据，去重
        const existingIds = new Set(events.value.map(e => e.id))
        const newEvents = rssNews.filter(e => !existingIds.has(e.id))
        events.value = [...newEvents, ...events.value].slice(0, 100)
        isLoading.value = false
        return
      }
    } catch (err) {
      console.warn('RSS refresh failed:', err)
    }

    // RSS 失败，尝试 API
    try {
      const response = await axios.get(`${API_BASE_URL}/news`, {
        timeout: 15000
      })

      if (response.data.success && response.data.data) {
        events.value = response.data.data.map((item: NewsEvent & { timestamp: string | Date }) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
    } catch (err) {
      console.error('Failed to refresh news:', err)
    } finally {
      isLoading.value = false
    }
  }

  function cleanupOldEvents() {
    const now = Date.now()
    events.value = events.value.filter(e => {
      const age = now - e.timestamp.getTime()
      return age <= FORTY_EIGHT_HOURS
    })
  }

  function startSimulation() {
    // Refresh news every 5 minutes (RSS sources don't need frequent updates)
    setInterval(() => {
      refreshNews()
    }, 5 * 60 * 1000)

    // Cleanup old events every minute
    setInterval(() => {
      cleanupOldEvents()
    }, 60000)
  }

  return {
    events,
    filteredEvents,
    liveEvents,
    stats,
    selectedCategory,
    newsScope,
    selectedEvent,
    isLoading,
    error,
    selectEvent,
    setCategory,
    setNewsScope,
    initializeEvents,
    refreshNews,
    startSimulation
  }
})
