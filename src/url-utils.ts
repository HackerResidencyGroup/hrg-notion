import isRelativeUrlImpl from 'is-relative-url'
import normalizeUrlImpl, {
  type Options as NormalizeUrlImplOptions
} from 'normalize-url'
import QuickLRU from 'quick-lru'

import { hashObject } from './utils'

const protocolAllowList = new Set(['https:', 'http:'])
const normalizedUrlCache = new QuickLRU<string, string>({
  maxSize: 4000
})

export function stripProtocol(url: string): string {
  // eslint-disable-next-line security/detect-unsafe-regex
  return url.replace(/^(https?:)?\/\//, '')
}

export function urlToUri(url?: string): string | undefined {
  if (!url) return

  let parsedUrl: URL | undefined
  try {
    parsedUrl = new URL(url)
  } catch {
    try {
      url = uriToUrl(url)
      if (!url) return
      parsedUrl = new URL(url)
    } catch {}
  }

  if (!parsedUrl) return

  return `${parsedUrl.hostname.replace(/^www\./, '')}${parsedUrl.pathname.replace(/\/+$/, '')}`
}

export function uriToUrl(uri?: string): string | undefined {
  if (!uri) return
  if (!uri.includes('.')) return

  try {
    new URL(uri)
    return uri
  } catch {
    const url = `https://${uri}`
    return new URL(url).href
  }
}

export function normalizeUrls(urls?: string[]): string[] {
  if (!urls?.length) return []

  return Array.from(new Set(urls.map((d) => normalizeUrl(d)).filter(Boolean)))
}

export function isValidCrawlableUrl(url: string): boolean {
  try {
    if (!url || isRelativeUrl(url)) {
      return false
    }

    const parsedUrl = new URL(url)
    if (!protocolAllowList.has(parsedUrl.protocol)) {
      return false
    }

    const normalizedUrl = normalizeUrl(url)
    if (!normalizedUrl) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export function isRelativeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false

  return isRelativeUrlImpl(url) && !url.startsWith('//')
}

export type NormalizeUrlOptions = NormalizeUrlImplOptions & {
  allowSloppyUris?: boolean
}

export function normalizeUrl(
  url?: string,
  { allowSloppyUris = true, ...options }: NormalizeUrlOptions = {}
): string | undefined {
  let normalizedUrl: string | undefined

  if (!url || typeof url !== 'string') {
    return undefined
  }

  if (isRelativeUrl(url)) {
    if (allowSloppyUris && !/^[#./]/.test(url) && url.indexOf('.') > 0) {
      url = `https://${url}`
    } else {
      return undefined
    }
  }

  const opts = {
    stripWWW: false,
    defaultProtocol: 'https',
    normalizeProtocol: true,
    forceHttps: false,
    stripHash: false,
    stripTextFragment: true,
    removeQueryParameters: [/^utm_\w+/i, 'ref', 'ref_src'],
    removeTrailingSlash: true,
    removeSingleSlash: true,
    removeExplicitPort: true,
    sortQueryParameters: true,
    ...options
  } as Required<NormalizeUrlOptions>

  const optionsHash = hashObject(opts)
  const cacheKey = `${url}-${optionsHash}`

  try {
    normalizedUrl = normalizedUrlCache.get(cacheKey)

    if (normalizedUrl !== undefined) {
      if (normalizedUrl) {
        return normalizedUrl
      } else {
        return undefined
      }
    }

    normalizedUrl = normalizeUrlImpl(url, opts)
    if (!normalizeUrl) {
      normalizedUrl = ''
    }
  } catch {
    // ignore invalid urls
    normalizedUrl = ''
  }

  normalizedUrlCache.set(cacheKey, normalizedUrl!)
  if (normalizedUrl) {
    return normalizedUrl
  } else {
    return undefined
  }
}
