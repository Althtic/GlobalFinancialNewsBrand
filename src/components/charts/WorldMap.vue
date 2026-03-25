<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NewsEvent, NewsScope } from '@/types'
import { categoryColors } from '@/constants/categories'

const props = defineProps<{
  events: NewsEvent[]
  scope: NewsScope
}>()

const emit = defineEmits<{
  (e: 'select', event: NewsEvent): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markers: Map<string, L.CircleMarker> = new Map()
let selectedEventId: string | null = null

const categoryIcons: Record<string, string> = {
  geopolitics: '🌐',
  economy: '💰',
  natural: '🌪️',
  corporate: '🏢',
  tech: '🤖'
}

const mapViews: Record<NewsScope, { center: [number, number]; zoom: number }> = {
  international: { center: [20, 0], zoom: 2 },
  domestic: { center: [35, 105], zoom: 4 },
  all: { center: [20, 0], zoom: 2 }
}

onMounted(() => {
  if (!mapContainer.value) return

  const view = mapViews[props.scope]

  map = L.map(mapContainer.value, {
    center: view.center,
    zoom: view.zoom,
    minZoom: 1,
    maxZoom: 10,
    worldCopyJump: true,
    zoomControl: false,
    attributionControl: false
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map)

  updateMarkers()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

watch(() => props.scope, (newScope) => {
  if (!map) return
  const view = mapViews[newScope] || mapViews.global
  map.flyTo(view.center, view.zoom, { duration: 1 })
})

watch(() => props.events, updateMarkers, { deep: true })

function updateMarkers() {
  if (!map) return

  markers.forEach(m => m.remove())
  markers.clear()

  props.events.forEach(event => {
    const [lng, lat] = event.location.coord
    const color = categoryColors[event.category]
    const icon = categoryIcons[event.category]

    const marker = L.circleMarker([lat, lng], {
      radius: event.impact.severity * 3 + 6,
      fillColor: color,
      color: selectedEventId === event.id ? '#fff' : 'rgba(255,255,255,0.5)',
      weight: selectedEventId === event.id ? 3 : 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map!)

    const sourceHtml = event.sourceUrl
      ? `<div style="margin-top: 8px; font-size: 11px;"><a href="${event.sourceUrl}" target="_blank" style="color:#409eff;text-decoration:none;">📰 ${event.sourceName || '来源'}</a></div>`
      : ''

    marker.bindPopup(`
      <div style="padding: 8px; min-width: 200px; max-width: 280px;">
        <div style="font-weight: bold; margin-bottom: 6px;">${icon} ${event.title}</div>
        <div style="color: #666; font-size: 12px;">📍 ${event.location.name}</div>
        <div style="margin-top: 4px; color: ${event.impact.direction === 'up' ? '#67c23a' : '#f56c6c'};">
          ${event.impact.direction === 'up' ? '📈' : '📉'} ${event.impact.market}
        </div>
        ${sourceHtml}
      </div>
    `)

    marker.on('click', () => {
      selectedEventId = event.id
      updateMarkers()
      emit('select', event)
    })

    markers.set(event.id, marker)
  })
}

function flyToLocation(event: NewsEvent) {
  if (!map) return

  const [lng, lat] = event.location.coord
  const zoom = 6

  map.flyTo([lat, lng], zoom, {
    duration: 1.5
  })

  // Open popup for the marker
  const marker = markers.get(event.id)
  if (marker) {
    setTimeout(() => {
      marker.openPopup()
    }, 500)
  }
}

defineExpose({
  flyToLocation
})
</script>

<template>
  <div class="world-map">
    <div ref="mapContainer" class="map-container"></div>
    <div class="legend">
      <div class="legend-item"><span class="dot" style="background:#f56c6c"></span>地缘政治</div>
      <div class="legend-item"><span class="dot" style="background:#409eff"></span>经济政策</div>
      <div class="legend-item"><span class="dot" style="background:#9c27b0"></span>科技/AI</div>
      <div class="legend-item"><span class="dot" style="background:#67c23a"></span>自然灾害</div>
      <div class="legend-item"><span class="dot" style="background:#e6a23c"></span>企业事件</div>
    </div>
  </div>
</template>

<style scoped>
.world-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #0a0a1a;
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(20, 20, 40, 0.9);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 13px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
