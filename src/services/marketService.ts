export interface MarketQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  region: 'china' | 'hongkong' | 'us' | 'europe' | 'japan'
  type: 'index' | 'stock'
}

export interface MarketData {
  timestamp: Date
  quotes: MarketQuote[]
}

// 指数配置
const MARKET_CONFIGS: MarketQuote[] = [
  // 中国A股
  { symbol: '000001', name: '上证指数', price: 0, change: 0, changePercent: 0, region: 'china', type: 'index' },
  { symbol: '399001', name: '深证成指', price: 0, change: 0, changePercent: 0, region: 'china', type: 'index' },
  { symbol: '399006', name: '创业板指', price: 0, change: 0, changePercent: 0, region: 'china', type: 'index' },

  // 港股
  { symbol: 'HSI', name: '恒生指数', price: 0, change: 0, changePercent: 0, region: 'hongkong', type: 'index' },
  { symbol: 'HSTECH', name: '恒生科技', price: 0, change: 0, changePercent: 0, region: 'hongkong', type: 'index' },

  // 美股
  { symbol: '^GSPC', name: '标普500', price: 0, change: 0, changePercent: 0, region: 'us', type: 'index' },
  { symbol: '^DJI', name: '道琼斯', price: 0, change: 0, changePercent: 0, region: 'us', type: 'index' },
  { symbol: '^IXIC', name: '纳斯达克', price: 0, change: 0, changePercent: 0, region: 'us', type: 'index' },

  // 欧洲
  { symbol: '^FTSE', name: '富时100', price: 0, change: 0, changePercent: 0, region: 'europe', type: 'index' },
  { symbol: '^GDAXI', name: '德国DAX', price: 0, change: 0, changePercent: 0, region: 'europe', type: 'index' },

  // 日本
  { symbol: '^N225', name: '日经225', price: 0, change: 0, changePercent: 0, region: 'japan', type: 'index' }
]

// 初始模拟数据（作为后备）
const MOCK_DATA: MarketQuote[] = [
  { symbol: '000001', name: '上证指数', price: 3080.15, change: 25.32, changePercent: 0.83, region: 'china', type: 'index' },
  { symbol: '399001', name: '深证成指', price: 9985.22, change: -35.18, changePercent: -0.35, region: 'china', type: 'index' },
  { symbol: '399006', name: '创业板指', price: 1985.56, change: 18.45, changePercent: 0.94, region: 'china', type: 'index' },
  { symbol: 'HSI', name: '恒生指数', price: 17832.45, change: -120.33, changePercent: -0.67, region: 'hongkong', type: 'index' },
  { symbol: 'HSTECH', name: '恒生科技', price: 3856.78, change: 45.67, changePercent: 1.20, region: 'hongkong', type: 'index' },
  { symbol: '^GSPC', name: '标普500', price: 5218.19, change: 15.29, changePercent: 0.29, region: 'us', type: 'index' },
  { symbol: '^DJI', name: '道琼斯', price: 39127.80, change: -45.12, changePercent: -0.12, region: 'us', type: 'index' },
  { symbol: '^IXIC', name: '纳斯达克', price: 16428.82, change: 112.47, changePercent: 0.69, region: 'us', type: 'index' },
  { symbol: '^FTSE', name: '富时100', price: 8075.45, change: 23.67, changePercent: 0.29, region: 'europe', type: 'index' },
  { symbol: '^GDAXI', name: '德国DAX', price: 18542.30, change: -38.92, changePercent: -0.21, region: 'europe', type: 'index' },
  { symbol: '^N225', name: '日经225', price: 40878.56, change: 256.78, changePercent: 0.63, region: 'japan', type: 'index' }
]

let cachedData: MarketQuote[] = [...MOCK_DATA]
let lastFetchTime = 0
const CACHE_DURATION = 30000 // 30秒缓存

// 生成随机波动（模拟实时变化）
function simulatePriceChange(quote: MarketQuote): MarketQuote {
  const volatility = quote.region === 'us' ? 0.001 : 0.0005 // 美股波动更大
  const randomChange = (Math.random() - 0.5) * 2 * volatility * quote.price

  const newPrice = Math.max(0, quote.price + randomChange)
  const newChange = quote.change + randomChange
  const newChangePercent = (newChange / (newPrice - newChange)) * 100

  return {
    ...quote,
    price: Number(newPrice.toFixed(2)),
    change: Number(newChange.toFixed(2)),
    changePercent: Number(newChangePercent.toFixed(2))
  }
}

// 从 Yahoo Finance 获取美股数据
async function fetchYahooFinance(symbol: string): Promise<MarketQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })

    if (!response.ok) return null

    const data = await response.json()
    const result = data.chart?.result?.[0]

    if (!result) return null

    const meta = result.meta
    const quote = result.indicators?.quote?.[0]

    if (!meta || !quote) return null

    const price = meta.regularMarketPrice || 0
    const previousClose = meta.previousClose || price
    const change = price - previousClose
    const changePercent = previousClose ? (change / previousClose) * 100 : 0

    return {
      symbol: meta.symbol,
      name: meta.shortName || meta.symbol,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      region: 'us',
      type: 'index'
    }
  } catch {
    return null
  }
}

// 从东方财富获取中国指数数据
async function fetchEastMoneyChina(symbol: string): Promise<MarketQuote | null> {
  try {
    // 东方财富 API
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${symbol}&fields=f43,f57,f58,f169,f170,f171`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })

    if (!response.ok) return null

    const data = await response.json()
    const quote = data.data

    if (!quote) return null

    const price = quote.f43 / 100 // 最新价
    const change = quote.f169 / 100 // 涨跌额
    const changePercent = quote.f170 / 100 // 涨跌幅

    const nameMap: Record<string, string> = {
      '000001': '上证指数',
      '399001': '深证成指',
      '399006': '创业板指'
    }

    return {
      symbol,
      name: nameMap[symbol] || symbol,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      region: 'china',
      type: 'index'
    }
  } catch {
    return null
  }
}

// 从东方财富获取恒生指数
async function fetchEastMoneyHK(symbol: string): Promise<MarketQuote | null> {
  try {
    // 恒生指数: 116.HK, 恒生科技: 7500.HK
    const secid = symbol === 'HSI' ? '116.HK' : '7500.HK'
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=f43,f57,f58,f169,f170,f171`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })

    if (!response.ok) return null

    const data = await response.json()
    const quote = data.data

    if (!quote) return null

    const price = quote.f43 / 100
    const change = quote.f169 / 100
    const changePercent = quote.f170 / 100

    const nameMap: Record<string, string> = {
      '116.HK': '恒生指数',
      '7500.HK': '恒生科技'
    }

    return {
      symbol,
      name: nameMap[secid] || symbol,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      region: 'hongkong',
      type: 'index'
    }
  } catch {
    return null
  }
}

// 获取所有市场数据
export async function fetchMarketData(): Promise<MarketData> {
  const now = Date.now()

  // 如果缓存未过期，返回缓存数据
  if (now - lastFetchTime < CACHE_DURATION && cachedData.length > 0) {
    // 模拟实时波动
    return {
      timestamp: new Date(),
      quotes: cachedData.map(q => simulatePriceChange(q))
    }
  }

  const newData: MarketQuote[] = []

  // 并行获取数据
  const promises = [
    // 中国A股
    fetchEastMoneyChina('000001'),
    fetchEastMoneyChina('399001'),
    fetchEastMoneyChina('399006'),
    // 港股
    fetchEastMoneyHK('HSI'),
    fetchEastMoneyHK('HSTECH'),
    // 美股
    fetchYahooFinance('^GSPC'),
    fetchYahooFinance('^DJI'),
    fetchYahooFinance('^IXIC')
  ]

  const results = await Promise.allSettled(promises)

  let idx = 0
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      newData.push(result.value)
    } else {
      // 使用 mock 数据中对应的项
      const mockQuote = MOCK_DATA[idx]
      if (mockQuote) {
        newData.push({ ...mockQuote })
      }
    }
    idx++
  }

  // 如果获取到的数据不完整，补充剩余的 mock 数据
  if (newData.length < MARKET_CONFIGS.length) {
    for (let i = newData.length; i < MARKET_CONFIGS.length; i++) {
      newData.push({ ...MOCK_DATA[i] || MARKET_CONFIGS[i] })
    }
  }

  cachedData = newData
  lastFetchTime = now

  return {
    timestamp: new Date(),
    quotes: newData
  }
}

// 获取格式化的时间字符串
export function getMarketTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 判断市场是否开盘
export function isMarketOpen(region: MarketQuote['region']): boolean {
  const now = new Date()
  const utcHour = now.getUTCHours()
  const chinaHour = (utcHour + 8) % 24 // 北京时间

  switch (region) {
    case 'china':
      // A股: 9:30-15:00 北京时间
      return chinaHour >= 9 && chinaHour < 15
    case 'hongkong':
      // 港股: 9:30-16:00 北京时间
      return chinaHour >= 9 && chinaHour < 16
    case 'us':
      // 美股: 21:30-次日4:00 北京时间（夏令时）
      return chinaHour >= 21 || chinaHour < 4
    case 'japan':
      // 日股: 9:00-15:00 北京时间
      return chinaHour >= 9 && chinaHour < 15
    case 'europe':
      // 欧股: 15:00-23:30 北京时间
      return chinaHour >= 15 || chinaHour < 0
    default:
      return false
  }
}
