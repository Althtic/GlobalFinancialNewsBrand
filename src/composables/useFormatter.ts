import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function useFormatter() {
  function formatTime(date: Date): string {
    return dayjs(date).fromNow()
  }

  function formatSeverity(severity: 1 | 2 | 3): string {
    const map = { 1: '低', 2: '中', 3: '高' }
    return map[severity]
  }

  return {
    formatTime,
    formatSeverity
  }
}