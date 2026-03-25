<script setup lang="ts">
import type { NewsEvent } from '@/types'
import TrendBadge from '@/components/common/TrendBadge.vue'
import { useFormatter } from '@/composables/useFormatter'
import { categoryLabels, categoryColors } from '@/constants/categories'

defineProps<{
  event: NewsEvent
  selected?: boolean
}>()

defineEmits<{
  (e: 'click', event: NewsEvent): void
}>()

const { formatTime, formatSeverity } = useFormatter()
</script>

<template>
  <div
    :class="['event-card', { selected, live: event.isLive }]"
    @click="$emit('click', event)"
  >
    <div class="card-header">
      <span
        class="category-tag"
        :style="{ backgroundColor: categoryColors[event.category] + '20', color: categoryColors[event.category] }"
      >
        {{ categoryLabels[event.category] }}
      </span>
      <span v-if="event.isLive" class="live-badge">
        <span class="live-dot"></span>
        LIVE
      </span>
      <a
        v-if="event.sourceUrl"
        :href="event.sourceUrl"
        target="_blank"
        class="source-link"
        @click.stop
        :title="'阅读原文: ' + event.sourceName"
      >
        🔗 阅读原文
      </a>
    </div>

    <h3 class="title">{{ event.title }}</h3>

    <div class="location">
      <span class="location-icon">📍</span>
      {{ event.location.name }} · {{ event.location.region }}
    </div>

    <p class="description">{{ event.description }}</p>

    <div class="card-footer">
      <TrendBadge
        :direction="event.impact.direction"
        :text="event.impact.market"
      />
      <div class="meta">
        <span class="severity" :title="'影响程度: ' + formatSeverity(event.impact.severity)">
          <span
            v-for="i in 3"
            :key="i"
            :class="['dot', { active: i <= event.impact.severity }]"
          ></span>
        </span>
        <span class="time">{{ formatTime(event.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  background: linear-gradient(135deg, #1e1e3f 0%, #2a2a4e 100%);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  opacity: 0;
  transition: opacity 0.3s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.event-card.selected {
  border-color: #409eff;
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.3);
}

.event-card.selected::before {
  opacity: 1;
}

.event-card.live {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: transparent; }
  50% { border-color: rgba(245, 108, 108, 0.5); }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #f56c6c;
  font-weight: bold;
}

.source-link {
  font-size: 11px;
  color: #409eff;
  text-decoration: none;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(64, 158, 255, 0.15);
  transition: all 0.2s;
}

.source-link:hover {
  background: rgba(64, 158, 255, 0.3);
  text-decoration: underline;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #f56c6c;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.location {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}

.location-icon {
  margin-right: 4px;
}

.description {
  font-size: 12px;
  color: #aaa;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.severity {
  display: flex;
  gap: 3px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #333;
}

.dot.active {
  background: #f56c6c;
}

.time {
  font-size: 11px;
  color: #666;
}
</style>