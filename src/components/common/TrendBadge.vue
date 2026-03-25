<script setup lang="ts">
defineProps<{
  direction: 'up' | 'down'
  text: string
}>()
</script>

<template>
  <span :class="['trend-badge', direction]">
    <span class="symbol">{{ direction === 'up' ? '↑' : '↓' }}</span>
    <span class="text">{{ text }}</span>
  </span>
</template>

<style scoped>
.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.trend-badge.up {
  background: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

.trend-badge.down {
  background: rgba(245, 108, 108, 0.15);
  color: #f56c6c;
}

.symbol {
  font-size: 14px;
}
</style>