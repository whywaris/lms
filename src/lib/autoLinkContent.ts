export interface AutoLinkTarget {
  keyword: string
  slug?: string
  type?: 'course' | 'blog'
  url?: string
  priority?: number
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getTargetUrl(target: AutoLinkTarget): string | null {
  if (target.url && target.url.trim()) {
    return target.url.trim()
  }
  if (target.slug && target.type) {
    return target.type === 'course' ? `/course/${target.slug}` : `/blog/${target.slug}`
  }
  return null
}

export function normalizeUrl(url: string): string {
  let u = url.trim().toLowerCase()
  try {
    if (u.startsWith('http://') || u.startsWith('https://')) {
      const parsed = new URL(u)
      u = parsed.pathname
    }
  } catch {
    // Keep as is
  }
  if (u.length > 1 && u.endsWith('/')) {
    u = u.slice(0, -1)
  }
  return u
}

interface Chunk {
  text: string
  isTag: boolean
  inExcluded: boolean
}

const EXCLUDED_TAGS = new Set([
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'code',
  'pre',
  'button',
  'script',
  'style',
])

export function autoLinkContent(
  html: string,
  targets: AutoLinkTarget[],
  currentPageUrl?: string,
  max: number = 6
): string {
  if (!html || !targets || targets.length === 0 || max <= 0) {
    return html || ''
  }

  const normalizedCurrentPageUrl = currentPageUrl ? normalizeUrl(currentPageUrl) : ''

  const validTargets = targets.filter((target) => {
    if (!target.keyword) return false
    const trimmedKeyword = target.keyword.trim()
    if (trimmedKeyword.length < 3) return false
    const url = getTargetUrl(target)
    if (!url) return false
    if (normalizedCurrentPageUrl && normalizeUrl(url) === normalizedCurrentPageUrl) return false
    return true
  })

  if (validTargets.length === 0) return html

  // Sort targets by priority desc (default 0), then keyword length desc
  validTargets.sort((a, b) => {
    const pA = a.priority ?? 0
    const pB = b.priority ?? 0
    if (pB !== pA) return pB - pA
    return b.keyword.trim().length - a.keyword.trim().length
  })

  // Deduplicate keywords keeping the highest priority / longest one
  const seenKeywords = new Set<string>()
  const uniqueTargets: AutoLinkTarget[] = []
  for (const target of validTargets) {
    const trimmedKeyword = target.keyword.trim()
    const lowerKeyword = trimmedKeyword.toLowerCase()
    if (!seenKeywords.has(lowerKeyword)) {
      seenKeywords.add(lowerKeyword)
      uniqueTargets.push({ ...target, keyword: trimmedKeyword })
    }
  }

  const tagRegex = /(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/g
  const chunks: Chunk[] = []
  let lastIndex = 0
  const excludedStack: string[] = []
  const usedUrls = new Set<string>()

  let match: RegExpExecArray | null
  while ((match = tagRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      chunks.push({
        text: html.slice(lastIndex, match.index),
        isTag: false,
        inExcluded: excludedStack.length > 0,
      })
    }

    const tag = match[0]
    if (!tag.startsWith('<!--')) {
      const openMatch = tag.match(/^<([a-zA-Z0-9]+)(\s|>|\/)/i)
      const closeMatch = tag.match(/^<\/([a-zA-Z0-9]+)\s*>/i)

      if (closeMatch) {
        const tagName = closeMatch[1].toLowerCase()
        if (EXCLUDED_TAGS.has(tagName)) {
          const lastIdx = excludedStack.lastIndexOf(tagName)
          if (lastIdx !== -1) {
            excludedStack.splice(lastIdx)
          }
        }
      } else if (openMatch) {
        const tagName = openMatch[1].toLowerCase()
        if (tagName === 'a') {
          const hrefMatch = tag.match(/\bhref=["']([^"']+)["']/i)
          if (hrefMatch && hrefMatch[1]) {
            usedUrls.add(normalizeUrl(hrefMatch[1]))
          }
        }
        const isSelfClosing = tag.endsWith('/>')
        if (EXCLUDED_TAGS.has(tagName) && !isSelfClosing) {
          excludedStack.push(tagName)
        }
      }
    }

    chunks.push({ text: tag, isTag: true, inExcluded: true })
    lastIndex = tagRegex.lastIndex
  }

  if (lastIndex < html.length) {
    chunks.push({
      text: html.slice(lastIndex),
      isTag: false,
      inExcluded: excludedStack.length > 0,
    })
  }

  let linksAdded = 0

  for (const target of uniqueTargets) {
    if (linksAdded >= max) break

    const rawUrl = getTargetUrl(target)
    if (!rawUrl) continue
    const normUrl = normalizeUrl(rawUrl)
    if (usedUrls.has(normUrl)) continue

    const escaped = escapeRegExp(target.keyword)
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'iu')

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      if (chunk.isTag || chunk.inExcluded) continue

      const m = regex.exec(chunk.text)
      if (m && m.index !== undefined) {
        const startIndex = m.index
        const matchedText = m[0]
        const before = chunk.text.slice(0, startIndex)
        const after = chunk.text.slice(startIndex + matchedText.length)

        const anchorHtml = `<a href="${rawUrl}" style="color: var(--color-primary); text-decoration: underline;">${matchedText}</a>`

        const replacementChunks: Chunk[] = []
        if (before) replacementChunks.push({ text: before, isTag: false, inExcluded: false })
        replacementChunks.push({ text: anchorHtml, isTag: false, inExcluded: true })
        if (after) replacementChunks.push({ text: after, isTag: false, inExcluded: false })

        chunks.splice(i, 1, ...replacementChunks)
        usedUrls.add(normUrl)
        linksAdded++
        break
      }
    }
  }

  return chunks.map((c) => c.text).join('')
}
