<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WorldMap from '@/components/charts/WorldMap.vue'
import NewsPanel from '@/components/dashboard/NewsPanel.vue'
import MarketOverview from '@/components/dashboard/MarketOverview.vue'
import { useNewsStore } from '@/stores/newsStore'
import type { NewsEvent, NewsScope } from '@/types'
import { categoryLabels } from '@/constants/categories'

const store = useNewsStore()
const detailEvent = ref<NewsEvent | null>(null)
const worldMapRef = ref<InstanceType<typeof WorldMap> | null>(null)

const scopeOptions: Array<{ value: NewsScope; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'domestic', label: '国内' },
  { value: 'international', label: '国际' }
]

onMounted(() => {
  store.initializeEvents()
  store.startSimulation()
})

function handleSelectEvent(event: NewsEvent) {
  detailEvent.value = event
  worldMapRef.value?.flyToLocation(event)
}

function setScope(scope: NewsScope) {
  store.setNewsScope(scope)
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="logo">📊 金融热点看板</h1>
        <p class="subtitle">实时追踪全球金融市场动态</p>
      </div>
      <div class="header-right">
        <div class="scope-switch">
          <button
            v-for="opt in scopeOptions"
            :key="opt.value"
            :class="['scope-btn', { active: store.newsScope === opt.value }]"
            @click="setScope(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="live-counter">
          <span class="live-dot"></span>
          <span>{{ store.liveEvents.length }} 个 LIVE</span>
        </div>
      </div>
    </header>

    <!-- 市场行情区域 -->
    <div class="market-bar">
      <MarketOverview />
    </div>

    <main class="dashboard-main">
      <div class="map-section">
        <WorldMap
          ref="worldMapRef"
          :events="store.filteredEvents"
          :scope="store.newsScope"
          @select="handleSelectEvent"
        />

        <Transition name="slide">
          <div v-if="detailEvent" class="event-detail">
            <div class="detail-header">
              <h3>{{ detailEvent.title }}</h3>
              <button class="close-btn" @click="detailEvent = null">×</button>
            </div>
            <div class="detail-body">
              <div class="detail-row">
                <span class="label">📍 地点</span>
                <span class="value">{{ detailEvent.location.name }}, {{ detailEvent.location.region }}</span>
              </div>
              <div class="detail-row">
                <span class="label">🏷️ 类别</span>
                <span class="value">{{ categoryLabels[detailEvent.category] }}</span>
              </div>
              <div class="detail-row">
                <span class="label">📈 影响</span>
                <span
                  :class="['value', 'impact', detailEvent.impact.direction]"
                >
                  {{ detailEvent.impact.direction === 'up' ? '↑' : '↓' }}
                  {{ detailEvent.impact.market }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">📝 详情</span>
                <p class="value description">{{ detailEvent.description }}</p>
              </div>
              <div v-if="detailEvent.sourceUrl" class="detail-row">
                <span class="label">📰 来源</span>
                <a :href="detailEvent.sourceUrl" target="_blank" class="source-link">
                  {{ detailEvent.sourceName || detailEvent.sourceUrl }}
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="news-section">
        <NewsPanel @select-event="handleSelectEvent" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0a0a14;
  color: #fff;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.market-bar {
  padding: 0 20px;
  background: #0a0a14;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtitle {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.live-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 20px;
  font-size: 13px;
  color: #f56c6c;
}

.scope-switch {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.scope-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.scope-btn:hover {
  color: #fff;
}

.scope-btn.active {
  background: rgba(64, 158, 255, 0.3);
  color: #409eff;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.dashboard-main {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 180px);
}

@media (max-width: 1400px) {
  .dashboard-main {
    grid-template-columns: 1fr 340px;
  }
}

@media (max-width: 1200px) {
  .dashboard-main {
    grid-template-columns: 1fr;
    height: auto;
  }
}

.map-section {
  position: relative;
  display: flex;
  flex-direction: column;
}

.event-detail {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(30, 30, 63, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-header h3 {
  margin: 0;
  font-size: 15px;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  gap: 12px;
}

.label {
  font-size: 12px;
  color: #888;
  min-width: 60px;
}

.value {
  font-size: 13px;
  color: #fff;
}

.value.impact.up {
  color: #67c23a;
}

.value.impact.down {
  color: #f56c6c;
}

.description {
  margin: 0;
  line-height: 1.5;
}

.source-link {
  color: #409eff;
  text-decoration: none;
  font-size: 13px;
}

.source-link:hover {
  text-decoration: underline;
}

.news-section {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>