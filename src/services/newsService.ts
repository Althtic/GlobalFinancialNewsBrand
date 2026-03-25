import type { NewsEvent } from '@/types'

interface RssItem {
  title: string
  link: string
  pubDate: string
  description?: string
  content?: string
}

interface NewsSource {
  name: string
  url: string
  category: NewsEvent['category']
  scope: 'domestic'
  keywords: string[]
  locationKeywords: Record<string, { name: string; coord: [number, number]; region: string }>
}

// 国内新闻 RSS 源
const NEWS_SOURCES: NewsSource[] = [
  {
    name: '36氪',
    url: 'https://36kr.com/feed',
    category: 'tech',
    scope: 'domestic',
    keywords: ['AI', '人工智能', '大模型', 'ChatGPT', 'GPT', '芯片', '半导体', '华为', '小米', '阿里', '腾讯', '百度', '字节', '自动驾驶', '新能源', '电动车', '特斯拉', '苹果', '谷歌', '微软', 'OpenAI', '英伟达', '经济', '政策', '金融', '股市', '央行', '降准', '加息', 'GDP', '房地产', '投资', '上市', 'IPO', '并购', '融资', '创业', '独角兽', '财报'],
    locationKeywords: {
      '北京': { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
      '上海': { name: '上海', coord: [121.5, 31.2], region: '亚洲' },
      '深圳': { name: '深圳', coord: [114.1, 22.5], region: '亚洲' },
      '杭州': { name: '杭州', coord: [120.2, 30.3], region: '亚洲' },
      '广州': { name: '广州', coord: [113.3, 23.1], region: '亚洲' },
      '成都': { name: '成都', coord: [104.1, 30.7], region: '亚洲' },
      '武汉': { name: '武汉', coord: [114.3, 30.6], region: '亚洲' },
      '西安': { name: '西安', coord: [108.9, 34.3], region: '亚洲' },
      '南京': { name: '南京', coord: [118.8, 32.1], region: '亚洲' },
      '苏州': { name: '苏州', coord: [120.6, 31.3], region: '亚洲' },
      '重庆': { name: '重庆', coord: [106.5, 29.5], region: '亚洲' },
      '天津': { name: '天津', coord: [117.2, 39.1], region: '亚洲' },
      '香港': { name: '香港', coord: [114.2, 22.3], region: '亚洲' },
      '台北': { name: '台北', coord: [121.5, 25.0], region: '亚洲' }
    }
  },
  {
    name: '虎嗅',
    url: 'https://www.huxiu.com/rss/feed.xml',
    category: 'tech',
    scope: 'domestic',
    keywords: ['AI', '人工智能', '大模型', 'ChatGPT', '芯片', '半导体', '华为', '小米', '阿里', '腾讯', '百度', '字节', '自动驾驶', '新能源', '电动车', '特斯拉', '苹果', '谷歌', '微软', 'OpenAI', '英伟达', '经济', '政策', '金融', '股市', '央行', '降准', '加息', 'GDP', '房地产', '投资', '上市', 'IPO', '并购', '融资', '创业', '独角兽', '财报', '商业', '企业', '巨头', '平台', '监管'],
    locationKeywords: {
      '北京': { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
      '上海': { name: '上海', coord: [121.5, 31.2], region: '亚洲' },
      '深圳': { name: '深圳', coord: [114.1, 22.5], region: '亚洲' },
      '杭州': { name: '杭州', coord: [120.2, 30.3], region: '亚洲' },
      '广州': { name: '广州', coord: [113.3, 23.1], region: '亚洲' },
      '成都': { name: '成都', coord: [104.1, 30.7], region: '亚洲' },
      '武汉': { name: '武汉', coord: [114.3, 30.6], region: '亚洲' },
      '西安': { name: '西安', coord: [108.9, 34.3], region: '亚洲' },
      '南京': { name: '南京', coord: [118.8, 32.1], region: '亚洲' },
      '苏州': { name: '苏州', coord: [120.6, 31.3], region: '亚洲' },
      '重庆': { name: '重庆', coord: [106.5, 29.5], region: '亚洲' },
      '天津': { name: '天津', coord: [117.2, 39.1], region: '亚洲' },
      '香港': { name: '香港', coord: [114.2, 22.3], region: '亚洲' },
      '台北': { name: '台北', coord: [121.5, 25.0], region: '亚洲' }
    }
  },
  {
    name: '极客公园',
    url: 'https://www.geekpark.net/rss',
    category: 'tech',
    scope: 'domestic',
    keywords: ['AI', '人工智能', '大模型', 'ChatGPT', 'GPT', '芯片', '半导体', '华为', '小米', '阿里', '腾讯', '百度', '字节', '自动驾驶', '新能源', '电动车', '特斯拉', '苹果', '谷歌', '微软', 'OpenAI', '英伟达', '科技', '产品', '发布', '创业', '投资'],
    locationKeywords: {
      '北京': { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
      '上海': { name: '上海', coord: [121.5, 31.2], region: '亚洲' },
      '深圳': { name: '深圳', coord: [114.1, 22.5], region: '亚洲' },
      '杭州': { name: '杭州', coord: [120.2, 30.3], region: '亚洲' },
      '广州': { name: '广州', coord: [113.3, 23.1], region: '亚洲' },
      '成都': { name: '成都', coord: [104.1, 30.7], region: '亚洲' },
      '武汉': { name: '武汉', coord: [114.3, 30.6], region: '亚洲' },
      '西安': { name: '西安', coord: [108.9, 34.3], region: '亚洲' },
      '南京': { name: '南京', coord: [118.8, 32.1], region: '亚洲' },
      '苏州': { name: '苏州', coord: [120.6, 31.3], region: '亚洲' },
      '重庆': { name: '重庆', coord: [106.5, 29.5], region: '亚洲' },
      '天津': { name: '天津', coord: [117.2, 39.1], region: '亚洲' },
      '香港': { name: '香港', coord: [114.2, 22.3], region: '亚洲' },
      '台北': { name: '台北', coord: [121.5, 25.0], region: '亚洲' }
    }
  },
  {
    name: '钛媒体',
    url: 'https://www.tmtpost.com/rss',
    category: 'tech',
    scope: 'domestic',
    keywords: ['AI', '人工智能', '大模型', 'ChatGPT', 'GPT', '芯片', '半导体', '华为', '小米', '阿里', '腾讯', '百度', '字节', '自动驾驶', '新能源', '电动车', '特斯拉', '苹果', '谷歌', '微软', 'OpenAI', '英伟达', '经济', '政策', '金融', '股市', '央行', '降准', '加息', 'GDP', '房地产', '投资', '上市', 'IPO', '并购', '融资', '创业', '独角兽', '财报', '商业', '企业', '5G', '云计算', '元宇宙', 'Web3'],
    locationKeywords: {
      '北京': { name: '北京', coord: [116.4, 39.9], region: '亚洲' },
      '上海': { name: '上海', coord: [121.5, 31.2], region: '亚洲' },
      '深圳': { name: '深圳', coord: [114.1, 22.5], region: '亚洲' },
      '杭州': { name: '杭州', coord: [120.2, 30.3], region: '亚洲' },
      '广州': { name: '广州', coord: [113.3, 23.1], region: '亚洲' },
      '成都': { name: '成都', coord: [104.1, 30.7], region: '亚洲' },
      '武汉': { name: '武汉', coord: [114.3, 30.6], region: '亚洲' },
      '西安': { name: '西安', coord: [108.9, 34.3], region: '亚洲' },
      '南京': { name: '南京', coord: [118.8, 32.1], region: '亚洲' },
      '苏州': { name: '苏州', coord: [120.6, 31.3], region: '亚洲' },
      '重庆': { name: '重庆', coord: [106.5, 29.5], region: '亚洲' },
      '天津': { name: '天津', coord: [117.2, 39.1], region: '亚洲' },
      '香港': { name: '香港', coord: [114.2, 22.3], region: '亚洲' },
      '台北': { name: '台北', coord: [121.5, 25.0], region: '亚洲' }
    }
  }
]

const CORS_PROXY = 'https://api.allorigins.win/raw?url='
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

function parseRSS(xml: string): RssItem[] {
  const items: RssItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]>|<\/title>/i
  const linkRegex = /<link>(.*?)<\/link>/i
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/i
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]>|<\/description>/i
  const contentRegex = /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]>|<\/content:encoded>/i

  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    const titleMatch = titleRegex.exec(itemXml)
    const linkMatch = linkRegex.exec(itemXml)
    const pubDateMatch = pubDateRegex.exec(itemXml)
    const descMatch = descRegex.exec(itemXml)
    const contentMatch = contentRegex.exec(itemXml)

    if (titleMatch && linkMatch) {
      let title = titleMatch[1] || titleMatch[0].replace('<title>', '').replace('</title>', '')
      title = title.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim()

      let link = linkMatch[1].trim()
      // 处理 Atom 格式的 link
      if (link === '' && /<link[^>]*href=["']([^"']+)["'][^>]*>/i.test(itemXml)) {
        const hrefMatch = itemXml.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)
        link = hrefMatch ? hrefMatch[1] : ''
      }

      items.push({
        title,
        link,
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toUTCString(),
        description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').substring(0, 300) : '',
        content: contentMatch ? contentMatch[1].replace(/<[^>]*>/g, '').substring(0, 500) : ''
      })
    }
  }
  return items
}

function parsePubDate(dateStr: string): Date {
  try {
    return new Date(dateStr)
  } catch {
    return new Date()
  }
}

function isWithin24Hours(date: Date): boolean {
  const now = Date.now()
  const diff = now - date.getTime()
  return diff >= 0 && diff <= TWENTY_FOUR_HOURS
}

function detectLocation(title: string, description: string, source: NewsSource): NewsEvent['location'] {
  const text = (title + ' ' + description).toLowerCase()

  for (const [keyword, location] of Object.entries(source.locationKeywords)) {
    if (text.includes(keyword.toLowerCase())) {
      return { ...location }
    }
  }

  // 默认位置
  return { name: '北京', coord: [116.4, 39.9], region: '亚洲' }
}

function detectCategory(title: string, description: string): NewsEvent['category'] {
  const text = (title + ' ' + description).toLowerCase()

  // 企业事件关键词
  const corporateKeywords = ['公司', '企业', '财报', '业绩', '收购', '并购', '上市', 'IPO', '融资', '投资', '创始人', 'CEO', '高管', '离职', '任命', '裁员', '产品发布', '合作', '签约']
  for (const kw of corporateKeywords) {
    if (text.includes(kw)) return 'corporate'
  }

  // 经济政策关键词
  const economyKeywords = ['央行', '降准', '加息', '减息', 'GDP', '经济', '政策', '监管', '财政部', '发改委', '商务部', '证监会', '银保监会', '房地产', '楼市', '股市', '汇市', '债市', '期货', '通胀', 'CPI', 'PPI', '进出口', '贸易', '关税', '制裁']
  for (const kw of economyKeywords) {
    if (text.includes(kw)) return 'economy'
  }

  // 默认为科技
  return 'tech'
}

function detectImpact(title: string, description: string): { market: string; direction: 'up' | 'down'; severity: 1 | 2 | 3 } {
  const text = (title + ' ' + description).toLowerCase()

  let severity: 1 | 2 | 3 = 1
  let direction: 'up' | 'down' = 'up'

  // 高影响关键词
  if (text.includes('大涨') || text.includes('暴涨') || text.includes('飙升') || text.includes('创新高') || text.includes('突破') || text.includes('重磅') || text.includes('史上首次')) {
    severity = 3
    direction = 'up'
  } else if (text.includes('大跌') || text.includes('暴跌') || text.includes('骤降') || text.includes('新低') || text.includes('腰斩') || text.includes('亏损') || text.includes('破产') || text.includes('倒闭') || text.includes('裁员') || text.includes('被查') || text.includes('制裁')) {
    severity = 3
    direction = 'down'
  } else if (text.includes('上涨') || text.includes('增长') || text.includes('上升') || text.includes('利好') || text.includes('发布') || text.includes('推出') || text.includes('获批') || text.includes('签约')) {
    severity = 2
    direction = 'up'
  } else if (text.includes('下跌') || text.includes('下降') || text.includes('下滑') || text.includes('利空') || text.includes('暂停') || text.includes('终止') || text.includes('取消') || text.includes('推迟')) {
    severity = 2
    direction = 'down'
  }

  // 市场检测
  let market = '科技股'
  if (text.includes('华为') || text.includes('芯片') || text.includes('半导体') || text.includes('集成电路')) {
    market = '科技/芯片'
  } else if (text.includes('阿里') || text.includes('阿里巴巴')) {
    market = '阿里概念'
  } else if (text.includes('腾讯') || text.includes('微信')) {
    market = '腾讯概念'
  } else if (text.includes('百度') || text.includes('文心')) {
    market = '百度概念'
  } else if (text.includes('字节') || text.includes('抖音') || text.includes('TikTok')) {
    market = '字节概念'
  } else if (text.includes('小米')) {
    market = '小米概念'
  } else if (text.includes('比亚迪') || text.includes('特斯拉') || text.includes('电动车') || text.includes('新能源车')) {
    market = '新能源车'
  } else if (text.includes('央行') || text.includes('降准') || text.includes('加息') || text.includes('利率')) {
    market = '金融'
  } else if (text.includes('茅台') || text.includes('白酒')) {
    market = '白酒'
  } else if (text.includes('房地产') || text.includes('万科') || text.includes('碧桂园') || text.includes('恒大')) {
    market = '房地产'
  } else if (text.includes('中石油') || text.includes('中石化') || text.includes('原油') || text.includes('油价')) {
    market = '能源'
  }

  return { market, direction, severity }
}

export async function fetchDomesticNews(): Promise<NewsEvent[]> {
  const events: NewsEvent[] = []

  for (const source of NEWS_SOURCES) {
    try {
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(source.url)}`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(proxyUrl, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) continue

      const xml = await response.text()
      const items = parseRSS(xml)

      for (const item of items.slice(0, 15)) {
        const pubDate = parsePubDate(item.pubDate)

        // 只包含最近24小时
        if (!isWithin24Hours(pubDate)) continue

        const title = item.title
        const desc = item.description || item.content || ''

        // 检查是否包含关键词
        const titleLower = title.toLowerCase()
        const descLower = desc.toLowerCase()
        const hasKeyword = source.keywords.some(k =>
          titleLower.includes(k.toLowerCase()) || descLower.includes(k.toLowerCase())
        )

        // 如果不是直接匹配，检查是否属于科技/AI/企业/经济类别
        const detectedCategory = detectCategory(title, desc)
        if (!hasKeyword && detectedCategory !== 'tech' && detectedCategory !== 'corporate' && detectedCategory !== 'economy') {
          continue
        }

        const location = detectLocation(title, desc, source)
        const impact = detectImpact(title, desc)

        // 合并描述
        const description = item.description || item.content || ''

        events.push({
          id: `rss-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title,
          location,
          category: detectedCategory,
          impact,
          description: description.substring(0, 200),
          timestamp: pubDate,
          isLive: isWithin24Hours(pubDate) && (Date.now() - pubDate.getTime()) < 2 * 60 * 60 * 1000,
          isDomestic: true,
          sourceUrl: item.link,
          sourceName: source.name
        })
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${source.name}:`, error)
    }
  }

  // 按时间排序
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return events
}
