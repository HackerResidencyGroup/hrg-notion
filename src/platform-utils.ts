import { normalizeUrl, uriToUrl } from './url-utils'

const twitterDomains = new Set([
  'twitter.com',
  'www.twitter.com',
  'x.com',
  'www.x.com'
])

export function isTwitterUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!twitterDomains.has(host)) return false

    const parts = pathname.split('/')
    if (parts.length < 2 || !parts[1]) return false

    return true
  } catch {
    return false
  }
}

export function normalizeTwitterProfileUri(uri?: string): string | undefined {
  const username = getTwitterUsername(uri) ?? getTwitterUsername(uriToUrl(uri))
  if (!username) return

  return `twitter.com/${username}`
}

const linkedInDomains = new Set([
  'linkedin.com',
  'www.linkedin.com',
  'lnkd.in',
  'linkedin.at',
  'mobile.linkedin.com',
  'linkedin.co.uk'
])

export function isLinkedInUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host } = new URL(url)
    return linkedInDomains.has(host)
  } catch {
    return false
  }
}

export function isLinkedInProfileUrl(
  url?: string,
  { type }: { type?: 'person' | 'company' } = {}
): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!linkedInDomains.has(host)) {
      return false
    }

    const parts = pathname.split('/')
    if (parts.length < 3) return false

    let part = parts[1]
    part = part === 'in' ? 'person' : part
    const identifier = parts[2]
    if (!identifier) return false

    if (part !== 'person' && part !== 'company' && part !== 'school') {
      return false
    }

    if (type && type !== part) {
      return false
    }

    return true
  } catch {
    return false
  }
}

const crunchbaseDomains = new Set(['crunchbase.com', 'www.crunchbase.com'])

export function isCrunchbaseProfileUrl(
  url?: string,
  { type }: { type?: 'person' | 'company' } = {}
): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!crunchbaseDomains.has(host)) {
      return false
    }

    const parts = pathname.split('/')
    if (parts.length < 3) return false

    let part = parts[1]
    part = part === 'organization' ? 'company' : part
    const identifier = parts[2]
    if (!identifier) return false

    if (part !== 'person' && part !== 'company') {
      return false
    }

    if (type && type !== part) {
      return false
    }

    return true
  } catch {
    return false
  }
}

const wikidataDomains = new Set(['wikidata.org', 'www.wikidata.org'])

export function isWikidataUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!wikidataDomains.has(host)) return false

    const parts = pathname.split('/')
    if (parts.length < 3) return false
    if (parts[1] !== 'wiki') return false
    if (!parts[2]?.startsWith('Q')) return false

    return true
  } catch {
    return false
  }
}

const githubDomains = new Set([
  'github.com',
  'www.github.com',
  'gist.github.com',
  'raw.githubusercontent.com'
])

export function isGitHubUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!githubDomains.has(host)) return false

    const parts = pathname.split('/')
    if (parts.length < 2) return false
    if (!parts[1]) return false

    return true
  } catch {
    return false
  }
}

const wikipediaDomains = new Set([
  'en.wikipedia.org',
  'en.m.wikipedia.org',
  'wikipedia.org'
])

export function isWikipediaUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname, searchParams } = new URL(url)

    if (pathname === '/w/index.php') {
      const title = searchParams.get('title')
      if (!title) return false
    } else {
      const pathnameParts = pathname.split('/')
      if (pathnameParts.length < 2) return false
      if (pathnameParts[1] !== 'wiki') return false
      if (!pathnameParts[2]) return false
    }

    if (wikipediaDomains.has(host)) return true

    const hostParts = host.split('.')
    if (hostParts.length > 2) {
      const rootDomain = hostParts.slice(-2).join('.')
      if (wikipediaDomains.has(rootDomain)) return true
    }

    return false
  } catch {}

  return false
}

const gravatarDomains = new Set(['gravatar.com', 'www.gravatar.com'])

export function isGravatarUrl(url?: string): url is string {
  if (!url) return false

  try {
    const { host, pathname } = new URL(url)
    if (!gravatarDomains.has(host)) return false

    const parts = pathname.split('/')
    if (parts.length < 2 || !parts[1] || parts[1] === 'avatar') return false

    return true
  } catch {
    return false
  }
}

export function getTwitterUsername(url?: string): string | undefined {
  url = uriToUrl(url) ?? url
  if (!isTwitterUrl(url)) return

  const { pathname } = new URL(url)
  return pathname.split('/')[1]
}

export function getLinkedinUsername(
  url?: string,
  opts: { type?: 'person' | 'company' } = {}
): string | undefined {
  url = uriToUrl(url) ?? url
  if (!isLinkedInProfileUrl(url, opts)) return

  const { pathname } = new URL(url)
  const parts = pathname.split('/')
  if (parts.length < 3) return

  return `${parts[1]}/${parts[2]}`
}

export function getGitHubUsername(url?: string): string | undefined {
  url = uriToUrl(url) ?? url
  if (!isGitHubUrl(url)) return

  const { pathname } = new URL(url)
  const username = pathname.split('/')[1]?.toLowerCase()
  if (!username || !/^[\da-z](?:[\da-z]|-(?=[\da-z])){0,38}$/i.test(username))
    return

  return username
}

export function getGravatarUsername(url?: string): string | undefined {
  url = uriToUrl(url) ?? url
  if (!isGravatarUrl(url)) return

  const { pathname } = new URL(url)
  return pathname.split('/')[1]
}

export function getGravatarUri(url?: string): string | undefined {
  const username = getGravatarUsername(url)
  if (!username) return

  return `gravatar.com/${username}`
}

export function getLinkedinUri(
  url?: string,
  opts: { type?: 'person' | 'company' } = {}
): string | undefined {
  const username = getLinkedinUsername(url, opts)
  if (!username) return

  return `linkedin.com/${username}`
}

export function getTwitterUri(url?: string): string | undefined {
  const username = getTwitterUsername(url)
  if (!username) return

  return `twitter.com/${username}`
}

export function getGitHubUri(url?: string): string | undefined {
  const username = getGitHubUsername(url)
  if (!username) return

  return `github.com/${username}`
}

export function getWikidataId(url?: string): string | undefined {
  if (!isWikidataUrl(url)) return

  const { pathname } = new URL(url)
  // TODO: this needs testing...
  return pathname.split('/')[2]
}

export function getWikipediaUri(url?: string): string | undefined {
  const title = getWikipediaTitle(url)
  if (!title) return

  return `en.wikipedia.org/wiki/${title}`
}

export function getWikipediaTitle(url?: string): string | undefined {
  if (!isWikipediaUrl(url)) return

  const { pathname, searchParams } = new URL(url)
  if (pathname === '/w/index.php') {
    const title = searchParams.get('title')
    if (title) return title
    return undefined
  } else {
    return pathname.split('/')[2]
  }
}

const wellKnownPlatformDomains = new Set([
  ...linkedInDomains,
  ...twitterDomains,
  ...wikidataDomains,
  ...wikipediaDomains,
  ...githubDomains,
  ...crunchbaseDomains,
  'angel.co',
  'theorg.com',
  'entrepreneur.com',
  'forbes.com',
  'producthunt.com',
  'slideshare.net',
  'medium.com',
  'substack.com',
  'gravatar.com',
  'dev.to',
  'youtube.com',
  'm.youtube.com',
  'stackoverflow.com',
  'wellfound.com',
  'indeed.com',
  'plus.google.com',
  'google.com',
  'quora.com',
  'flickr.com',
  'instagram.com',
  'tiktok.com',
  'reddit.com',
  'discord.com',
  'hubspot.com',
  'thefactual.com',
  'facebook.com',
  'www.facebook.com',
  'fastpeoplesearch.com',
  'researchgate.net',
  'imdb.com',
  'waatp.com',
  'dbpedia.org',
  'yahoo.com',
  'classmates.com'
])

export function isWellKnownPlatformDomain(url?: string): boolean {
  if (!url) return false

  try {
    const normalizedUrl = normalizeUrl(url)?.toLowerCase()
    if (!normalizedUrl) return false

    const { host } = new URL(normalizedUrl)
    if (wellKnownPlatformDomains.has(host)) return true
    if (/^www\./.test(host)) {
      const nonWWWHost = host.split('.').slice(1).join('.')
      if (wellKnownPlatformDomains.has(nonWWWHost)) return true
    } else {
      const wwwHost = `www.${host}`
      if (wellKnownPlatformDomains.has(wwwHost)) return true
    }

    const parts = host.split('.')
    if (parts.length > 2) {
      const rootDomain = parts.slice(-2).join('.')
      if (wellKnownPlatformDomains.has(rootDomain)) return true
    }
  } catch {}

  return false
}

const wellKnownEmailProviderDomains = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'hotmail.co.uk',
  'hotmail.it',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'me.com',
  'qq.com',
  'live.com',
  'live.fr',
  'live.co.uk',
  'googlemail.com',
  'free.fr',
  'rediffmail.com',
  'gmx.de',
  'yandex.ru',
  'libero.it',
  'ymail.com',
  'wanadoo.fr',
  'orange.fr',
  'comcast.net',
  'msn.com',
  'apple.com',
  'aol.com',
  'att.net',
  'comcast.net',
  'facebook.com',
  'gmx.com',
  'google.com',
  'mac.com',
  'mail.com',
  'sbcglobal.net',
  'verizon.net',
  'email.com',
  'fastmail.fm',
  'games.com',
  'gmx.net',
  'hush.com',
  'hushmail.com',
  'icloud.com',
  'iname.com',
  'inbox.com',
  'lavabit.com',
  'love.com',
  'outlook.com',
  'pobox.com',
  'protonmail.ch',
  'tutanota.de',
  'tutanota.com',
  'tutamail.com',
  'tuta.io',
  'keemail.me',
  'rocketmail.com',
  'safe-mail.net',
  'wow.com',
  'ygm.com',
  'ymail.com',
  'yandex.com',
  'bellsouth.net',
  'charter.net',
  'cox.net',
  'earthlink.net',
  'juno.com',
  'btinternet.com',
  'virginmedia.com',
  'blueyonder.co.uk',
  'freeserve.co.uk',
  'live.co.uk',
  'ntlworld.com',
  'o2.co.uk',
  'orange.net',
  'sky.com',
  'talktalk.co.uk',
  'tiscali.co.uk',
  'virgin.net',
  'wanadoo.co.uk',
  'bt.com',
  'sina.com',
  'sina.cn',
  'qq.com',
  'naver.com',
  'hanmail.net',
  'daum.net',
  'nate.com',
  'yahoo.co.uk',
  'yahoo.co.jp',
  'yahoo.co.kr',
  'yahoo.co.id',
  'yahoo.co.in',
  'yahoo.com.sg',
  'yahoo.com.ph',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.it',
  'yahoo.com.ar',
  'yahoo.com.mx',
  'yahoo.ca',
  'yahoo.com.br',
  '163.com',
  'yeah.net',
  '126.com',
  '21cn.com',
  'aliyun.com',
  'foxmail.com',
  'hotmail.fr',
  'live.fr',
  'laposte.net',
  'wanadoo.fr',
  'orange.fr',
  'gmx.fr',
  'sfr.fr',
  'neuf.fr',
  'free.fr',
  'gmx.de',
  'hotmail.de',
  'live.de',
  'online.de',
  't-online.de',
  'web.de',
  'libero.it',
  'virgilio.it',
  'hotmail.it',
  'aol.it',
  'tiscali.it',
  'alice.it',
  'live.it',
  'email.it',
  'tin.it',
  'poste.it',
  'teletu.it',
  'mail.ru',
  'rambler.ru',
  'yandex.ru',
  'ya.ru',
  'list.ru',
  'hotmail.be',
  'live.be',
  'skynet.be',
  'voo.be',
  'tvcablenet.be',
  'telenet.be',
  'hotmail.com.ar',
  'live.com.ar',
  'fibertel.com.ar',
  'speedy.com.ar',
  'arnet.com.ar',
  'live.com.mx',
  'hotmail.es',
  'hotmail.com.mx',
  'prodigy.net.mx',
  'hotmail.ca',
  'bell.net',
  'shaw.ca',
  'sympatico.ca',
  'rogers.com',
  'hotmail.com.br',
  'outlook.com.br',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'ig.com.br',
  'itelefonica.com.br',
  'r7.com',
  'zipmail.com.br',
  'globo.com',
  'globomail.com',
  'oi.com.br'
])

/**
 * Attempts to parse a custom domain from an email address. If the email uses a
 * well-known email provider (gmail, outlook, etc), will return `undefined`.
 *
 * The aim of this function is to extract custom domains that are likely to be
 * associated with a person's business or brand, so personal emails will be
 * excluded.
 */
export function getCustomDomainFromEmail(email: string): string | undefined {
  const domain = email.split('@')[1]?.trim().toLowerCase()
  if (!domain || domain.indexOf('.') <= 0) {
    return
  }

  if (domain.endsWith('.')) {
    return
  }

  try {
    new URL(`https://${domain}`)
  } catch {
    return
  }

  if (wellKnownEmailProviderDomains.has(domain)) {
    return
  }

  if (/^yahoo\./.test(domain)) {
    return
  }

  if (/^gmail\./.test(domain)) {
    return
  }

  if (/^hotmail\./.test(domain)) {
    return
  }

  if (/^live\./.test(domain)) {
    return
  }

  return domain
}
