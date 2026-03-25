import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// News API configurations
const NEWS_APIS = {
  // NewsData.io - free tier, no CORS issues
  newsdata: {
    baseUrl: 'https://newsdata.io/api/1',
    key: 'pub_1990b39656bf4b91acb9f63bc85f67df'
  },
  // GNews API - free tier available
  gnews: {
    baseUrl: 'https://gnews.io/api/v4',
    key: process.env.GNEWS_API_KEY || ''
  }
}

// Finance and tech keywords for filtering
const TECH_FINANCE_KEYWORDS = [
  'AI', 'artificial intelligence', 'OpenAI', 'Google', 'Microsoft', 'Apple', 'Tesla',
  'Nvidia', 'chip', 'semiconductor', 'IPO', 'startup', 'tech', 'digital',
  'stock', 'market', 'economy', 'Federal Reserve', 'inflation', 'GDP',
  'crypto', 'bitcoin', 'ethereum', 'blockchain', 'fintech', 'banking',
  'regulation', 'antitrust', 'Big Tech', 'Meta', 'Amazon', 'ARM', 'GPU',
  'LLM', 'GPT', 'neural', 'model', 'robotics', 'autonomous', 'EV'
]

// Location detection for tech/finance news
const LOCATION_MAP = {
  'san francisco': { name: '硅谷', coord: [-122.4, 37.8], region: '北美' },
  'silicon valley': { name: '硅谷', coord: [-122.4, 37.8], region: '北美' },
  'california': { name: '加州', coord: [-120.0, 36.0], region: '北美' },
  'seattle': { name: '西雅图', coord: [-122.3, 47.6], region: '北美' },
  'new york': { name: '纽约', coord: [-74.0, 40.7], region: '北美' },
  'wall street': { name: '纽约', coord: [-74.0, 40.7], region: '北美' },
  'washington': { name: '华盛顿', coord: [-77.0, 38.9], region: '北美' },
  'london': { name: '伦敦', coord: [-0.1, 51.5], region: '欧洲' },
  'uk': { name: '伦敦', coord: [-0.1, 51.5], region: '欧洲' },
  'europe': { name: '欧盟', coord: [10.0, 52.0], region: '欧洲' },
  'germany': { name: '德国', coord: [13.4, 52.5], region: '欧洲' },
  'france': { name: '法国', coord: [2.3, 48.9], region: '欧洲' },
  'china': { name: '中国', coord: [116.4, 39.9], region: '亚洲' },
  'beijing': { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
  'shenzhen': { name: '深圳', coord: [114.1, 22.5], region: '亚洲' },
  'taiwan': { name: '台湾', coord: [121.0, 23.5], region: '亚洲' },
  'japan': { name: '东京', coord: [139.7, 35.7], region: '亚洲' },
  'tokyo': { name: '东京', coord: [139.7, 35.7], region: '亚洲' },
  'korea': { name: '首尔', coord: [126.9, 37.5], region: '亚洲' },
  'south korea': { name: '首尔', coord: [126.9, 37.5], region: '亚洲' },
  'india': { name: '印度', coord: [77.2, 28.6], region: '亚洲' },
  'singapore': { name: '新加坡', coord: [103.8, 1.3], region: '亚洲' },
  'dubai': { name: '迪拜', coord: [55.3, 25.2], region: '中东' },
  'middle east': { name: '中东', coord: [45.0, 30.0], region: '中东' },
  'russia': { name: '俄罗斯', coord: [37.6, 55.8], region: '欧洲' },
  'moscow': { name: '莫斯科', coord: [37.6, 55.8], region: '欧洲' },
  'brazil': { name: '巴西', coord: [-47.9, -15.8], region: '南美' },
  'australia': { name: '悉尼', coord: [151.2, -33.9], region: '大洋洲' },
}

function detectLocation(title, description) {
  const text = (title + ' ' + description).toLowerCase()

  for (const [keyword, location] of Object.entries(LOCATION_MAP)) {
    if (text.includes(keyword)) {
      return location
    }
  }

  return { name: '全球', coord: [0, 20], region: '其他' }
}

function detectImpact(title, description) {
  const text = (title + ' ' + description).toLowerCase()

  let severity = 1
  let direction = 'up'

  if (/surge|soar|record high|breakthrough|surprise|beat|exceed/.test(text)) {
    severity = 3
    direction = 'up'
  } else if (/crash|plunge|ban|fail|loss|layoff|investigation|probe/.test(text)) {
    severity = 3
    direction = 'down'
  } else if (/rise|growth|announce|launch|expand|acquire/.test(text)) {
    severity = 2
    direction = 'up'
  } else if (/fall|drop|cut|reduce|delay|concern/.test(text)) {
    severity = 2
    direction = 'down'
  }

  let market = '科技股'
  if (/nvidia|gpu|chip|semiconductor|amd|intel/.test(text)) {
    market = '芯片股'
  } else if (/apple|iphone|mac|ipad/.test(text)) {
    market = '苹果概念'
  } else if (/google|alphabet|android/.test(text)) {
    market = '谷歌'
  } else if (/microsoft|windows|azure|office/.test(text)) {
    market = '微软'
  } else if (/tesla|electric vehicle|ev/.test(text)) {
    market = '特斯拉/新能源'
  } else if (/amazon|aws|prime/.test(text)) {
    market = '亚马逊'
  } else if (/meta|facebook|instagram|whatsapp/.test(text)) {
    market = 'Meta'
  } else if (/crypto|bitcoin|ethereum|bTC|ETH/.test(text)) {
    market = '加密货币'
  } else if (/federal reserve|fed|interest rate|inflation/.test(text)) {
    market = '美股/美元'
  } else if (/IPO|stock|market|share/.test(text)) {
    market = '科技股'
  }

  return { market, direction, severity }
}

function getCategory(title, description) {
  const text = (title + ' ' + description).toLowerCase()

  const techKeywords = /AI|artificial intelligence|OpenAI|GPT|neural|model|LLM|chip|semiconductor|robot|tech|gadget|software|digital|cloud|cyber/

  if (techKeywords.test(text)) {
    return 'tech'
  }

  if (/economy|GDP|inflation|unemployment|trade|central bank|interest rate|monetary/.test(text)) {
    return 'economy'
  }

  if (/war|conflict| sanction| diplomatic| summit| meeting| president| government| election/.test(text)) {
    return 'geopolitics'
  }

  if (/earthquake|flood|typhoon|hurricane|storm|wildfire|climate|disaster/.test(text)) {
    return 'natural'
  }

  if (/company|earnings|revenue|acquisition|merger|CEO|founder|board/.test(text)) {
    return 'corporate'
  }

  return 'tech' // Default to tech for finance-related news
}

function isWithin48Hours(dateStr) {
  try {
    const date = new Date(dateStr)
    const now = Date.now()
    const diff = now - date.getTime()
    return diff >= 0 && diff <= 48 * 60 * 60 * 1000
  } catch {
    return false
  }
}

// Transform raw news to our format
function transformNewsItem(item) {
  const title = item.title || item.title_original || ''
  const description = item.description || item.content || ''
  const location = detectLocation(title, description)
  const impact = detectImpact(title, description)
  const category = getCategory(title, description)

  return {
    id: `news-${Buffer.from(item.link || item.url || Math.random().toString()).toString('base64').substring(0, 12)}`,
    title: title.substring(0, 200),
    location,
    category,
    impact,
    description: description.substring(0, 300),
    timestamp: item.pubDate ? new Date(item.pubDate) : new Date(),
    isLive: isWithin48Hours(item.pubDate) && (Date.now() - new Date(item.pubDate).getTime()) < 2 * 60 * 60 * 1000,
    sourceUrl: item.link || item.url || '',
    sourceName: item.source_id || item.source || ''
  }
}

// Fetch from NewsData.io API
async function fetchFromNewsData() {
  try {
    const response = await axios.get(`${NEWS_APIS.newsdata.baseUrl}/news`, {
      params: {
        apikey: NEWS_APIS.newsdata.key,
        language: 'en',
        category: 'technology',
        size: 50
      },
      timeout: 10000
    })

    if (response.data.results) {
      return response.data.results
        .filter(item => isWithin48Hours(item.pubDate))
        .map(transformNewsItem)
    }
    return []
  } catch (error) {
    console.error('NewsData.io error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    }
    return []
  }
}

// Fetch from GNews API
async function fetchFromGNews() {
  if (!NEWS_APIS.gnews.key) {
    return []
  }

  try {
    const response = await axios.get(`${NEWS_APIS.gnews.baseUrl}/search`, {
      params: {
        apikey: NEWS_APIS.gnews.key,
        q: 'tech OR AI OR finance OR economy OR stock market',
        lang: 'en',
        max: 30
      },
      timeout: 10000
    })

    if (response.data.articles) {
      return response.data.articles
        .filter(item => isWithin48Hours(item.publishedAt))
        .map(item => transformNewsItem({
          title: item.title,
          description: item.description,
          link: item.url,
          source: item.source.name,
          pubDate: item.publishedAt
        }))
    }
    return []
  } catch (error) {
    console.error('GNews error:', error.message)
    return []
  }
}

// API Routes
app.get('/api/news', async (req, res) => {
  try {
    // Fetch from multiple sources in parallel
    const [newsdataResults] = await Promise.all([
      fetchFromNewsData()
    ])

    let allNews = [...newsdataResults]

    // If no real API key, return demo data
    if (allNews.length === 0) {
      return res.json({
        success: true,
        data: generateDemoNews(),
        message: 'Using demo data - set NEWS_API_KEY environment variable for real news'
      })
    }

    // Sort by timestamp, newest first
    allNews.sort((a, b) => b.timestamp - a.timestamp)

    // Filter to last 48 hours only
    const now = Date.now()
    allNews = allNews.filter(item => (now - item.timestamp.getTime()) <= 48 * 60 * 60 * 1000)

    res.json({
      success: true,
      data: allNews,
      count: allNews.length
    })
  } catch (error) {
    console.error('News API error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      data: generateDemoNews()
    })
  }
})

// Demo news data when API is not configured
function generateDemoNews() {
  const now = Date.now()

  return [
    {
      id: 'demo-1',
      title: 'OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities',
      location: { name: '硅谷', coord: [-122.4, 37.8], region: '北美' },
      category: 'tech',
      impact: { market: 'AI概念股', direction: 'up', severity: 3 },
      description: 'OpenAI has unveiled GPT-5, claiming significant improvements in reasoning and multimodal capabilities that outperform existing models.',
      timestamp: new Date(now - 1000 * 60 * 60 * 2),
      isLive: true,
      sourceUrl: 'https://techcrunch.com/2024/03/24/openai-announces-gpt-5-breakthrough/',
      sourceName: 'TechCrunch'
    },
    {
      id: 'demo-2',
      title: 'Federal Reserve Signals Potential Rate Cuts in Coming Months',
      location: { name: '华盛顿', coord: [-77.0, 38.9], region: '北美' },
      category: 'economy',
      impact: { market: '美股/美元', direction: 'up', severity: 3 },
      description: 'Fed Chair signals that rate cuts may be appropriate if inflation continues to moderate, boosting market sentiment.',
      timestamp: new Date(now - 1000 * 60 * 60 * 4),
      isLive: false,
      sourceUrl: 'https://www.reuters.com/markets/us/fed-signals-rate-cuts-2024-03-24/',
      sourceName: 'Reuters'
    },
    {
      id: 'demo-3',
      title: 'Nvidia Reports Record Quarterly Revenue on AI Chip Demand',
      location: { name: '加州', coord: [-121.0, 38.0], region: '北美' },
      category: 'tech',
      impact: { market: '芯片股', direction: 'up', severity: 3 },
      description: 'Nvidia surpasses expectations with record revenue driven by unprecedented demand for AI training chips from data centers.',
      timestamp: new Date(now - 1000 * 60 * 60 * 6),
      isLive: false,
      sourceUrl: 'https://www.bloomberg.com',
      sourceName: 'Bloomberg'
    },
    {
      id: 'demo-4',
      title: 'EU regulators launch antitrust investigation into major tech platforms',
      location: { name: '布鲁塞尔', coord: [4.4, 50.8], region: '欧洲' },
      category: 'tech',
      impact: { market: '科技巨头', direction: 'down', severity: 2 },
      description: 'European Commission opens formal investigation into potential violations of Digital Markets Act by leading tech companies.',
      timestamp: new Date(now - 1000 * 60 * 60 * 8),
      isLive: false,
      sourceUrl: 'https://www.bbc.com/news/technology',
      sourceName: 'BBC Tech'
    },
    {
      id: 'demo-5',
      title: 'China unveils new regulations on generative AI services',
      location: { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
      category: 'tech',
      impact: { market: 'AI概念', direction: 'down', severity: 2 },
      description: 'Chinese authorities release comprehensive rules for AI-generated content, requiring security assessments and compliance measures.',
      timestamp: new Date(now - 1000 * 60 * 60 * 12),
      isLive: false,
      sourceUrl: 'https://www.scmp.com/tech/china-tech/article/3254123/china-ai-regulations-2024',
      sourceName: 'SCMP'
    },
    {
      id: 'demo-6',
      title: 'Tesla无人驾驶出租车获批在多个城市商业化运营',
      location: { name: '得克萨斯', coord: [-97.3, 31.0], region: '北美' },
      category: 'tech',
      impact: { market: '特斯拉', direction: 'up', severity: 3 },
      description: '监管机构批准特斯拉无人驾驶出租车在凤凰城、旧金山等城市开始商业运营。',
      timestamp: new Date(now - 1000 * 60 * 60 * 18),
      isLive: false,
      sourceUrl: 'https://www.reuters.com/tech/tesla-robotaxi-approved-commercial-2024-03-23/',
      sourceName: 'Reuters'
    },
    {
      id: 'demo-7',
      title: 'Apple Vision Pro销量超预期，带动供应链股价上涨',
      location: { name: '硅谷', coord: [-122.4, 37.8], region: '北美' },
      category: 'tech',
      impact: { market: '苹果概念', direction: 'up', severity: 2 },
      description: '分析师报告显示Apple Vision Pro需求强劲，代工厂扩产，概念股集体走强。',
      timestamp: new Date(now - 1000 * 60 * 60 * 24),
      isLive: false,
      sourceUrl: 'https://asia.nikkei.com/ Tech/apple-vision-pro-sales-exceed-expectations-2024',
      sourceName: 'Nikkei Asia'
    },
    {
      id: 'demo-8',
      title: 'Global chip shortage expected to ease further in Q2',
      location: { name: '台北', coord: [121.5, 25.0], region: '亚洲' },
      category: 'tech',
      impact: { market: '芯片股', direction: 'up', severity: 2 },
      description: 'TSMC and Samsung report improved production capacity, with analysts predicting relief for auto and consumer electronics industries.',
      timestamp: new Date(now - 1000 * 60 * 60 * 30),
      isLive: false,
      sourceUrl: 'https://www.ft.com/tech/chip-shortage-easing-q2-2024',
      sourceName: 'Financial Times'
    },
    {
      id: 'demo-9',
      title: 'Microsoft Azure AI服务大规模升级，企业客户增长强劲',
      location: { name: '华盛顿', coord: [-77.0, 38.9], region: '北美' },
      category: 'tech',
      impact: { market: '微软', direction: 'up', severity: 2 },
      description: '微软发布Azure AI新功能，企业采用率大幅提升，股价创历史新高。',
      timestamp: new Date(now - 1000 * 60 * 60 * 36),
      isLive: false,
      sourceUrl: 'https://www.bloomberg.com/tech/microsoft-azure-ai-upgrade-2024',
      sourceName: 'Bloomberg'
    },
    {
      id: 'demo-10',
      title: '加密货币市场波动剧烈，比特币失守关键支撑位',
      location: { name: '全球', coord: [0, 20], region: '其他' },
      category: 'tech',
      impact: { market: '加密货币', direction: 'down', severity: 3 },
      description: '比特币跌破重要心理关口5万美元，监管趋严和技术面因素引发抛售潮。',
      timestamp: new Date(now - 1000 * 60 * 60 * 40),
      isLive: false,
      sourceUrl: 'https://www.coindesk.com/price/bitcoin/bitcoin-falls-50000-march-2024/',
      sourceName: 'CoinDesk'
    },
    {
      id: 'demo-11',
      title: '英国央行维持利率不变，但下调经济增长预期',
      location: { name: '伦敦', coord: [-0.1, 51.5], region: '欧洲' },
      category: 'economy',
      impact: { market: '英镑', direction: 'down', severity: 2 },
      description: '英格兰银行决定保持利率稳定，但警告英国经济面临滞胀风险。',
      timestamp: new Date(now - 1000 * 60 * 60 * 42),
      isLive: false,
      sourceUrl: 'https://www.reuters.com/markets/uk/boe-holds-rates-downgrades-growth-2024-03-23/',
      sourceName: 'Reuters'
    },
    {
      id: 'demo-12',
      title: '日本央行超宽松政策转向预期升温，日元大幅升值',
      location: { name: '东京', coord: [139.7, 35.7], region: '亚洲' },
      category: 'economy',
      impact: { market: '日元', direction: 'up', severity: 3 },
      description: '日本央行暗示可能调整收益率曲线控制政策，交易员押注货币政策正常化。',
      timestamp: new Date(now - 1000 * 60 * 60 * 44),
      isLive: false,
      sourceUrl: 'https://www.ft.com/markets/asia-pacific/japan-boj-policy-shift-yen-2024',
      sourceName: 'Financial Times'
    }
  ]
}

app.listen(PORT, () => {
  console.log(`News API server running on http://localhost:${PORT}`)
  console.log(`API endpoint: http://localhost:${PORT}/api/news`)
})
