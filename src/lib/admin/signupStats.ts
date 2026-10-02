export interface SignupDataPoint {
  date: string
  label: string
  count: number
}

export interface PeriodStats {
  period: 'daily' | 'weekly' | 'monthly'
  title: string
  subtitle: string
  currentTotal: number
  previousTotal: number
  changePercent: number
  changeText: string
  trend: 'up' | 'down' | 'neutral'
  data: SignupDataPoint[]
}

export interface WeeklyConversionPoint {
  week: string
  label: string
  totalSignups: number
  lifetimeSignups: number
  conversionRate: number
}

export interface ConversionStatsResult {
  totalSignups: number
  lifetimeMembers: number
  conversionRate: number // e.g. 12.5
  conversionRateFormatted: string // e.g. "12.5%"
  weeklyTrend: WeeklyConversionPoint[]
}

export interface SourceStatItem {
  source: string
  signups: number
  lifetime: number
  conversionRate: number
  conversionRateFormatted: string
}

export interface SignupStatsResult {
  daily: PeriodStats
  weekly: PeriodStats
  monthly: PeriodStats
  conversion: ConversionStatsResult
  sources: SourceStatItem[]
}

export interface TopPageItem {
  slug: string
  title: string
  views: number
  path: string
}

export interface TopPagesResult {
  courses7d: TopPageItem[]
  courses30d: TopPageItem[]
  blogs7d: TopPageItem[]
  blogs30d: TopPageItem[]
}

function calculateComparison(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) {
      return { changePercent: 0, changeText: '0%', trend: 'neutral' as const }
    }
    return { changePercent: 100, changeText: '+100%', trend: 'up' as const }
  }

  const diff = current - previous
  const percent = Math.round((diff / previous) * 100)
  const sign = percent > 0 ? '+' : ''
  const trend = percent > 0 ? ('up' as const) : percent < 0 ? ('down' as const) : ('neutral' as const)

  return {
    changePercent: percent,
    changeText: `${sign}${percent}%`,
    trend,
  }
}

function toLocalDateString(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface RawProfileRecord {
  created_at: string | null
  plan?: string | null
  source?: string | null
}

export function computeSignupStats(profiles: RawProfileRecord[]): SignupStatsResult {
  const now = new Date()

  // Pre-process valid profiles
  const processed = profiles.map((p) => ({
    time: p.created_at ? new Date(p.created_at).getTime() : NaN,
    isLifetime: p.plan === 'lifetime',
    source: (p.source && p.source.trim()) ? p.source.trim().toLowerCase() : 'direct',
  })).filter((p) => !isNaN(p.time))

  const totalSignups = profiles.length
  const lifetimeMembers = profiles.filter((p) => p.plan === 'lifetime').length
  const overallConversionRate = totalSignups > 0 ? Number(((lifetimeMembers / totalSignups) * 100).toFixed(1)) : 0

  // -------------------------------------------------------------
  // 1. DAILY (Last 30 days)
  // -------------------------------------------------------------
  const dailyDataMap = new Map<string, number>()
  const dailyBuckets: SignupDataPoint[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const key = toLocalDateString(d)
    dailyDataMap.set(key, 0)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    dailyBuckets.push({
      date: key,
      label,
      count: 0,
    })
  }

  const dailyCurrentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0).getTime()
  const dailyCurrentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()
  const dailyPrevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 59, 0, 0, 0, 0).getTime()
  const dailyPrevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 23, 59, 59, 999).getTime()

  let dailyCurrentTotal = 0
  let dailyPrevTotal = 0

  for (const item of processed) {
    if (item.time >= dailyCurrentStart && item.time <= dailyCurrentEnd) {
      dailyCurrentTotal++
      const d = new Date(item.time)
      const key = toLocalDateString(d)
      if (dailyDataMap.has(key)) {
        dailyDataMap.set(key, (dailyDataMap.get(key) || 0) + 1)
      }
    } else if (item.time >= dailyPrevStart && item.time <= dailyPrevEnd) {
      dailyPrevTotal++
    }
  }

  for (const bucket of dailyBuckets) {
    bucket.count = dailyDataMap.get(bucket.date) || 0
  }

  const dailyComp = calculateComparison(dailyCurrentTotal, dailyPrevTotal)
  const daily: PeriodStats = {
    period: 'daily',
    title: 'Daily Signups (Last 30 Days)',
    subtitle: 'vs. previous 30 days',
    currentTotal: dailyCurrentTotal,
    previousTotal: dailyPrevTotal,
    ...dailyComp,
    data: dailyBuckets,
  }

  // -------------------------------------------------------------
  // 2. WEEKLY (Last 12 weeks) + Weekly Conversion Trend
  // -------------------------------------------------------------
  interface WeekBucket extends SignupDataPoint {
    startTime: number
    endTime: number
    lifetimeCount: number
  }

  const weeklyBuckets: WeekBucket[] = []
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()
  const msInWeek = 7 * 24 * 60 * 60 * 1000

  for (let w = 11; w >= 0; w--) {
    const weekEndTime = endOfToday - w * msInWeek
    const weekStartTime = weekEndTime - msInWeek + 1
    const startDate = new Date(weekStartTime)
    const endDate = new Date(weekEndTime)

    const label = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    weeklyBuckets.push({
      date: `W${12 - w}`,
      label,
      count: 0,
      lifetimeCount: 0,
      startTime: weekStartTime,
      endTime: weekEndTime,
    })
  }

  const weeklyCurrentStart = weeklyBuckets[0].startTime
  const weeklyCurrentEnd = weeklyBuckets[weeklyBuckets.length - 1].endTime
  const weeklyPrevStart = weeklyCurrentStart - 12 * msInWeek
  const weeklyPrevEnd = weeklyCurrentStart - 1

  let weeklyCurrentTotal = 0
  let weeklyPrevTotal = 0

  for (const item of processed) {
    if (item.time >= weeklyCurrentStart && item.time <= weeklyCurrentEnd) {
      weeklyCurrentTotal++
      for (const bucket of weeklyBuckets) {
        if (item.time >= bucket.startTime && item.time <= bucket.endTime) {
          bucket.count++
          if (item.isLifetime) {
            bucket.lifetimeCount++
          }
          break
        }
      }
    } else if (item.time >= weeklyPrevStart && item.time <= weeklyPrevEnd) {
      weeklyPrevTotal++
    }
  }

  const weeklyComp = calculateComparison(weeklyCurrentTotal, weeklyPrevTotal)
  const weekly: PeriodStats = {
    period: 'weekly',
    title: 'Weekly Signups (Last 12 Weeks)',
    subtitle: 'vs. previous 12 weeks',
    currentTotal: weeklyCurrentTotal,
    previousTotal: weeklyPrevTotal,
    ...weeklyComp,
    data: weeklyBuckets.map(({ date, label, count }) => ({ date, label, count })),
  }

  const weeklyTrend: WeeklyConversionPoint[] = weeklyBuckets.map((b) => {
    const convRate = b.count > 0 ? Number(((b.lifetimeCount / b.count) * 100).toFixed(1)) : 0
    return {
      week: b.date,
      label: b.label,
      totalSignups: b.count,
      lifetimeSignups: b.lifetimeCount,
      conversionRate: convRate,
    }
  })

  // -------------------------------------------------------------
  // 3. MONTHLY (Last 12 months)
  // -------------------------------------------------------------
  const monthlyBuckets: Array<SignupDataPoint & { startTime: number; endTime: number }> = []

  for (let m = 11; m >= 0; m--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - m, 1, 0, 0, 0, 0)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59, 999)
    const key = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`
    const label = monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

    monthlyBuckets.push({
      date: key,
      label,
      count: 0,
      startTime: monthStart.getTime(),
      endTime: monthEnd.getTime(),
    })
  }

  const monthlyCurrentStart = monthlyBuckets[0].startTime
  const monthlyCurrentEnd = monthlyBuckets[monthlyBuckets.length - 1].endTime
  const prev12MonthStart = new Date(now.getFullYear(), now.getMonth() - 23, 1, 0, 0, 0, 0).getTime()
  const prev12MonthEnd = new Date(now.getFullYear(), now.getMonth() - 11, 0, 23, 59, 59, 999).getTime()

  let monthlyCurrentTotal = 0
  let monthlyPrevTotal = 0

  for (const item of processed) {
    if (item.time >= monthlyCurrentStart && item.time <= monthlyCurrentEnd) {
      monthlyCurrentTotal++
      for (const bucket of monthlyBuckets) {
        if (item.time >= bucket.startTime && item.time <= bucket.endTime) {
          bucket.count++
          break
        }
      }
    } else if (item.time >= prev12MonthStart && item.time <= prev12MonthEnd) {
      monthlyPrevTotal++
    }
  }

  const monthlyComp = calculateComparison(monthlyCurrentTotal, monthlyPrevTotal)
  const monthly: PeriodStats = {
    period: 'monthly',
    title: 'Monthly Signups (Last 12 Months)',
    subtitle: 'vs. previous 12 months',
    currentTotal: monthlyCurrentTotal,
    previousTotal: monthlyPrevTotal,
    ...monthlyComp,
    data: monthlyBuckets.map(({ date, label, count }) => ({ date, label, count })),
  }

  // -------------------------------------------------------------
  // 4. SIGNUPS BY SOURCE
  // -------------------------------------------------------------
  const sourceMap = new Map<string, { signups: number; lifetime: number }>()

  for (const p of profiles) {
    const rawSource = (p.source && p.source.trim()) ? p.source.trim().toLowerCase() : 'direct'
    const entry = sourceMap.get(rawSource) || { signups: 0, lifetime: 0 }
    entry.signups++
    if (p.plan === 'lifetime') {
      entry.lifetime++
    }
    sourceMap.set(rawSource, entry)
  }

  const sources: SourceStatItem[] = Array.from(sourceMap.entries()).map(([source, stats]) => {
    const rate = stats.signups > 0 ? Number(((stats.lifetime / stats.signups) * 100).toFixed(1)) : 0
    return {
      source,
      signups: stats.signups,
      lifetime: stats.lifetime,
      conversionRate: rate,
      conversionRateFormatted: `${rate}%`,
    }
  }).sort((a, b) => b.signups - a.signups)

  const conversion: ConversionStatsResult = {
    totalSignups,
    lifetimeMembers,
    conversionRate: overallConversionRate,
    conversionRateFormatted: `${overallConversionRate}%`,
    weeklyTrend,
  }

  return {
    daily,
    weekly,
    monthly,
    conversion,
    sources,
  }
}

export interface RawPageView {
  path: string
  page_type: 'course' | 'blog' | 'other'
  slug: string | null
  created_at: string
}

export interface CourseLookup {
  slug: string
  course_name: string
}

export interface BlogLookup {
  slug: string
  title: string
}

export function computeTopPages(
  pageViews: RawPageView[],
  courses: CourseLookup[],
  blogs: BlogLookup[]
): TopPagesResult {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

  const courseTitleMap = new Map<string, string>()
  for (const c of courses) {
    if (c.slug) courseTitleMap.set(c.slug, c.course_name)
  }

  const blogTitleMap = new Map<string, string>()
  for (const b of blogs) {
    if (b.slug) blogTitleMap.set(b.slug, b.title)
  }

  const courseViews7d = new Map<string, number>()
  const courseViews30d = new Map<string, number>()
  const blogViews7d = new Map<string, number>()
  const blogViews30d = new Map<string, number>()

  for (const pv of pageViews) {
    const t = new Date(pv.created_at).getTime()
    if (isNaN(t)) continue

    if (pv.page_type === 'course' && pv.slug) {
      if (t >= thirtyDaysAgo) {
        courseViews30d.set(pv.slug, (courseViews30d.get(pv.slug) || 0) + 1)
      }
      if (t >= sevenDaysAgo) {
        courseViews7d.set(pv.slug, (courseViews7d.get(pv.slug) || 0) + 1)
      }
    } else if (pv.page_type === 'blog' && pv.slug) {
      if (t >= thirtyDaysAgo) {
        blogViews30d.set(pv.slug, (blogViews30d.get(pv.slug) || 0) + 1)
      }
      if (t >= sevenDaysAgo) {
        blogViews7d.set(pv.slug, (blogViews7d.get(pv.slug) || 0) + 1)
      }
    }
  }

  const mapToSortedList = (
    viewMap: Map<string, number>,
    titleMap: Map<string, string>,
    pathPrefix: string
  ): TopPageItem[] => {
    return Array.from(viewMap.entries())
      .map(([slug, views]) => ({
        slug,
        title: titleMap.get(slug) || slug,
        views,
        path: `${pathPrefix}/${slug}`,
      }))
      .sort((a, b) => b.views - a.views)
  }

  return {
    courses7d: mapToSortedList(courseViews7d, courseTitleMap, '/courses'),
    courses30d: mapToSortedList(courseViews30d, courseTitleMap, '/courses'),
    blogs7d: mapToSortedList(blogViews7d, blogTitleMap, '/blog'),
    blogs30d: mapToSortedList(blogViews30d, blogTitleMap, '/blog'),
  }
}
