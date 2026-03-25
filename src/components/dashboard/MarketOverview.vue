<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { fetchMarketData, getMarketTimeString, isMarketOpen, type MarketQuote } from '@/services/marketService'

const quotes = ref<MarketQuote[]>([])
const lastUpdate = ref<string>('')
const isLoading = ref(true)

// 分类显示
const chinaQuotes = computed(() => quotes.value.filter(q => q.region === 'china'))
const hkQuotes = computed(() => quotes.value.filter(q => q.region === 'hongkong'))
const usQuotes = computed(() => quotes.value.filter(q => q.region === 'us'))
const otherQuotes = computed(() => quotes.value.filter(q => q.region === 'japan' || q.region === 'europe'))

let updateInterval: number | null = null

async function updateData() {
  try {
    const data = await fetchMarketData()
    quotes.value = data.quotes
    lastUpdate.value = getMarketTimeString(data.timestamp)
    isLoading.value = false
  } catch (err) {
    console.error('Failed to fetch market data:', err)
    isLoading.value = false
  }
}

function formatPrice(price: number): string {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

function getMarketStatus(region: MarketQuote['region']): 'open' | 'closed' | 'pre' {
  return isMarketOpen(region) ? 'open' : 'closed'
}

onMounted(() => {
  updateData()
  // 每 10 秒更新一次
  updateInterval = window.setInterval(updateData, 10000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<template>
  <div class="market-overview">
    <div class="market-header">
      <h3 class="market-title">📈 全球市场</h3>
      <div class="update-info">
        <span v-if="lastUpdate" class="update-time">更新 {{ lastUpdate }}</span>
        <span v-if="isLoading" class="loading">加载中...</span>
      </div>
    </div>

    <div class="market-content">
      <!-- A股 -->
      <div class="market-section">
        <div class="section-title">
          <span class="section-icon">🇨🇳</span>
          <span>A股</span>
        </div>
        <div class="quotes-grid">
          <div
            v-for="quote in chinaQuotes"
            :key="quote.symbol"
            class="quote-card"
          >
            <div class="quote-name">{{ quote.name }}</div>
            <div class="quote-price" :class="{ rising: quote.change > 0, falling: quote.change < 0 }">
              {{ formatPrice(quote.price) }}
            </div>
            <div
              class="quote-change"
              :class="{ positive: quote.change >= 0, negative: quote.change < 0 }"
            >
              <span class="change-value">{{ formatChange(quote.change) }}</span>
              <span class="change-percent">{{ formatPercent(quote.changePercent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 港股 -->
      <div class="market-section">
        <div class="section-title">
          <span class="section-icon">🇭🇰</span>
          <span>港股</span>
        </div>
        <div class="quotes-grid">
          <div
            v-for="quote in hkQuotes"
            :key="quote.symbol"
            class="quote-card"
          >
            <div class="quote-name">{{ quote.name }}</div>
            <div class="quote-price" :class="{ rising: quote.change > 0, falling: quote.change < 0 }">
              {{ formatPrice(quote.price) }}
            </div>
            <div
              class="quote-change"
              :class="{ positive: quote.change >= 0, negative: quote.change < 0 }"
            >
              <span class="change-value">{{ formatChange(quote.change) }}</span>
              <span class="change-percent">{{ formatPercent(quote.changePercent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 美股 -->
      <div class="market-section">
        <div class="section-title">
          <span class="section-icon">🇺🇸</span>
          <span>美股</span>
        </div>
        <div class="quotes-grid">
          <div
            v-for="quote in usQuotes"
            :key="quote.symbol"
            class="quote-card"
          >
            <div class="quote-name">{{ quote.name }}</div>
            <div class="quote-price" :class="{ rising: quote.change > 0, falling: quote.change < 0 }">
              {{ formatPrice(quote.price) }}
            </div>
            <div
              class="quote-change"
              :class="{ positive: quote.change >= 0, negative: quote.change < 0 }"
            >
              <span class="change-value">{{ formatChange(quote.change) }}</span>
              <span class="change-percent">{{ formatPercent(quote.changePercent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他 -->
      <div class="market-section">
        <div class="section-title">
          <span class="section-icon">🌏</span>
          <span>其他</span>
        </div>
        <div class="quotes-grid">
          <div
            v-for="quote in otherQuotes"
            :key="quote.symbol"
            class="quote-card"
          >
            <div class="quote-name">{{ quote.name }}</div>
            <div class="quote-price" :class="{ rising: quote.change > 0, falling: quote.change < 0 }">
              {{ formatPrice(quote.price) }}
            </div>
            <div
              class="quote-change"
              :class="{ positive: quote.change >= 0, negative: quote.change < 0 }"
            >
              <span class="change-value">{{ formatChange(quote.change) }}</span>
              <span class="change-percent">{{ formatPercent(quote.changePercent) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-overview {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.market-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-time {
  font-size: 11px;
  color: #666;
}

.loading {
  font-size: 11px;
  color: #409eff;
}

.market-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.market-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}

.section-icon {
  font-size: 14px;
}

.quotes-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-card {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  transition: background 0.2s;
}

.quote-card:hover {
  background: rgba(255, 255, 255, 0.06);
}

.quote-name {
  font-size: 12px;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quote-price {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-align: right;
}

.quote-price.rising {
  color: #67c23a;
}

.quote-price.falling {
  color: #f56c6c;
}

.quote-change {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 70px;
}

.change-value {
  font-size: 11px;
  color: #888;
}

.change-percent {
  font-size: 12px;
  font-weight: 500;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}

.positive .change-percent,
.negative .change-percent {
  color: inherit;
}
</style>
