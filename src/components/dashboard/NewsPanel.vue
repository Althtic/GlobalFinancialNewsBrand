<script setup lang="ts">
import { useNewsStore } from '@/stores/newsStore'
import EventCard from './EventCard.vue'
import type { EventCategory } from '@/types'
import { categoryLabels } from '@/constants/categories'

const store = useNewsStore()

const categories: Array<{ value: EventCategory | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value: value as EventCategory, label }))
]

const emit = defineEmits<{
  (e: 'select-event', event: any): void
}>()

function handleRefresh() {
  store.refreshNews()
}
</script>

<template>
  <div class="news-panel">
    <div class="panel-header">
      <h2 class="panel-title">
        <span class="icon">📰</span>
        金融热点事件
      </h2>
      <div class="header-actions">
        <span class="event-count">{{ store.filteredEvents.length }} 个事件</span>
        <button
          class="refresh-btn"
          :class="{ spinning: store.isLoading }"
          @click="handleRefresh"
          :disabled="store.isLoading"
          title="刷新新闻"
        >
          🔄
        </button>
      </div>
    </div>

    <div class="filter-tabs">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="['tab', { active: store.selectedCategory === cat.value }]"
        @click="store.setCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="event-list">
      <TransitionGroup name="event">
        <EventCard
          v-for="event in store.filteredEvents"
          :key="event.id"
          :event="event"
          :selected="store.selectedEvent?.id === event.id"
          @click="(e) => { store.selectEvent(e); emit('select-event', e) }"
        />
      </TransitionGroup>

      <div v-if="store.filteredEvents.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关事件</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%);
  border-radius: 12px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.refresh-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(64, 158, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(64, 158, 255, 0.3);
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-btn.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.icon {
  font-size: 18px;
}

.event-count {
  font-size: 12px;
  color: #666;
}

.filter-tabs {
  display: flex;
  gap: 6px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.tab {
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

.tab.active {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
}

.event-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.event-list::-webkit-scrollbar {
  width: 4px;
}

.event-list::-webkit-scrollbar-track {
  background: transparent;
}

.event-list::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.event-enter-active,
.event-leave-active {
  transition: all 0.4s ease;
}

.event-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.event-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>