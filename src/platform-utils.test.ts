import { expect, test } from 'vitest'

import {
  getCustomDomainFromEmail,
  getGitHubUsername,
  getGravatarUri,
  getGravatarUsername,
  getLinkedinUri,
  getLinkedinUsername,
  getTwitterUsername,
  getWikipediaUri,
  isCrunchbaseProfileUrl,
  isGitHubUrl,
  isGravatarUrl,
  isLinkedInProfileUrl,
  isTwitterUrl,
  isWellKnownPlatformDomain,
  isWikidataUrl,
  normalizeTwitterProfileUri
} from './platform-utils'

test('isLinkedInProfileUrl', () => {
  expect(isLinkedInProfileUrl('https://www.linkedin.com/in/username')).toBe(
    true
  )
  expect(
    isLinkedInProfileUrl('https://www.linkedin.com/company/username')
  ).toBe(true)
  expect(isLinkedInProfileUrl('https://www.linkedin.com/posts/username')).toBe(
    false
  )
  expect(
    isLinkedInProfileUrl('https://linkedin.com/in/username', { type: 'person' })
  ).toBe(true)
  expect(
    isLinkedInProfileUrl('https://linkedin.com/company/username', {
      type: 'company'
    })
  ).toBe(true)
  expect(
    isLinkedInProfileUrl('https://linkedin.com/in/username', {
      type: 'company'
    })
  ).toBe(false)
  expect(
    isLinkedInProfileUrl('https://linkedin.com/company/username', {
      type: 'person'
    })
  ).toBe(false)
  expect(isLinkedInProfileUrl('https://linkedin.com/posts/username')).toBe(
    false
  )
  expect(isLinkedInProfileUrl('in/username')).toBe(false)
  expect(isLinkedInProfileUrl('https://linkedin.com/in/')).toBe(false)
})

test('getLinkedinUsername', () => {
  expect(getLinkedinUsername('https://www.linkedin.com/in/username')).toBe(
    'in/username'
  )
  expect(getLinkedinUsername('https://www.linkedin.com/company/username')).toBe(
    'company/username'
  )
  expect(
    getLinkedinUsername('https://www.linkedin.com/in/username/foo/bar')
  ).toBe('in/username')
  expect(getLinkedinUsername('https://www.linkedin.com/posts/foo')).toBe(
    undefined
  )
  expect(getLinkedinUsername('https://www.linkedin.com')).toBe(undefined)
  expect(getLinkedinUsername('https://www.example.com/in/username')).toBe(
    undefined
  )
  expect(getLinkedinUsername('in/username')).toBe(undefined)
})

test('getLinkedinUri', () => {
  expect(getLinkedinUri('https://www.linkedin.com/in/username')).toBe(
    'linkedin.com/in/username'
  )
  expect(getLinkedinUri('https://www.linkedin.com/company/username')).toBe(
    'linkedin.com/company/username'
  )
  expect(getLinkedinUri('https://www.linkedin.com/in/username/foo/bar')).toBe(
    'linkedin.com/in/username'
  )
  expect(getLinkedinUri('https://www.linkedin.com/posts/foo')).toBe(undefined)
  expect(getLinkedinUri('https://www.linkedin.com')).toBe(undefined)
  expect(getLinkedinUri('https://www.example.com/in/username')).toBe(undefined)
  expect(getLinkedinUri('in/username')).toBe(undefined)
})

test('isTwitterUrl', () => {
  expect(isTwitterUrl('https://twitter.com/username')).toBe(true)
  expect(isTwitterUrl('https://x.com/username')).toBe(true)
  expect(isTwitterUrl('https://www.x.com/username/status/1000')).toBe(true)
  expect(isTwitterUrl('https://twitter.com/')).toBe(false)
  expect(isTwitterUrl('https://twitter.com/')).toBe(false)
  expect(isTwitterUrl('https://twitter.com//')).toBe(false)
  expect(isTwitterUrl('https://example.com/foo')).toBe(false)
  expect(isTwitterUrl('@transitive_bs')).toBe(false)

  // Valid Twitter URLs
  expect(isTwitterUrl('https://twitter.com/username')).toBe(true)
  expect(isTwitterUrl('https://x.com/username')).toBe(true)
  expect(isTwitterUrl('https://twitter.com/username/status/123')).toBe(true)
  expect(isTwitterUrl('https://x.com/username/status/123')).toBe(true)

  // Invalid Twitter URLs
  expect(isTwitterUrl()).toBe(false)
  expect(isTwitterUrl('')).toBe(false)
  expect(isTwitterUrl('not-a-url')).toBe(false)
  expect(isTwitterUrl('https://example.com')).toBe(false)
  expect(isTwitterUrl('https://twitter.com/')).toBe(false)
  expect(isTwitterUrl('https://x.com/')).toBe(false)
  expect(isTwitterUrl('https://twitter.com/status')).toBe(true)
  expect(isTwitterUrl('https://x.com/status')).toBe(true)
})

test('getTwitterUsername', () => {
  // Valid Twitter URLs
  expect(getTwitterUsername('https://twitter.com/username')).toBe('username')
  expect(getTwitterUsername('https://x.com/username')).toBe('username')
  expect(getTwitterUsername('https://twitter.com/username/status/123')).toBe(
    'username'
  )
  expect(getTwitterUsername('https://x.com/username/status/123')).toBe(
    'username'
  )
  expect(getTwitterUsername('https://twitter.com/status')).toBe('status')
  expect(getTwitterUsername('https://x.com/status')).toBe('status')
  expect(getTwitterUsername('https://x.com/fiatlucy')).toBe('fiatlucy')

  // Invalid Twitter URLs
  expect(getTwitterUsername()).toBeUndefined()
  expect(getTwitterUsername('')).toBeUndefined()
  expect(getTwitterUsername('not-a-url')).toBeUndefined()
  expect(getTwitterUsername('https://example.com')).toBeUndefined()
  expect(getTwitterUsername('https://twitter.com/')).toBeUndefined()
  expect(getTwitterUsername('https://x.com/')).toBeUndefined()
})

test('normalizeTwitterProfileUri', () => {
  expect(normalizeTwitterProfileUri('https://twitter.com/username')).toBe(
    'twitter.com/username'
  )
  expect(normalizeTwitterProfileUri('https://twitter.com/username')).toBe(
    'twitter.com/username'
  )
  expect(
    normalizeTwitterProfileUri('https://www.x.com/username/status/1000')
  ).toBe('twitter.com/username')
  expect(normalizeTwitterProfileUri('https://twitter.com/')).toBe(undefined)
  expect(normalizeTwitterProfileUri('https://twitter.com/')).toBe(undefined)
  expect(normalizeTwitterProfileUri('https://twitter.com//')).toBe(undefined)
  expect(normalizeTwitterProfileUri('https://example.com/foo')).toBe(undefined)
  expect(normalizeTwitterProfileUri('@transitive_bs')).toBe(undefined)
})

test('getWikipediaUri', () => {
  expect(getWikipediaUri('https://en.wikipedia.org/wiki/username')).toBe(
    'en.wikipedia.org/wiki/username'
  )
  expect(getWikipediaUri('https://de.wikipedia.org/wiki/Elon_Musk')).toBe(
    'en.wikipedia.org/wiki/Elon_Musk'
  )
  expect(
    getWikipediaUri('http://wikipedia.org/wiki/Elon_Musk/foo?referer=bar')
  ).toBe('en.wikipedia.org/wiki/Elon_Musk')

  expect(
    getWikipediaUri('https://en.wikipedia.org/w/index.php?title=Elon_Musk')
  ).toBe('en.wikipedia.org/wiki/Elon_Musk')

  expect(getWikipediaUri('https://example.com/wiki/username')).toBe(undefined)
})

test('getCustomDomainFromEmail', () => {
  expect(getCustomDomainFromEmail('foo@bob.com')).toBe('bob.com')
  expect(getCustomDomainFromEmail('foo@transitivebullsh.it')).toBe(
    'transitivebullsh.it'
  )

  expect(getCustomDomainFromEmail('foo')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@invalid')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@.')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@.com')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@bar.')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@bar.baz.')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@gmail.com')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@GMAIL.com')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@yahoo.com')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@apple.com')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@yahoo.co.uk')).toBe(undefined)
  expect(getCustomDomainFromEmail('foo@yahoo.a.b.c')).toBe(undefined)
})

test('isWellKnownPlatformDomain', () => {
  expect(isWellKnownPlatformDomain('twitter.com')).toBe(true)
  expect(isWellKnownPlatformDomain('https://twitter.com')).toBe(true)
  // TODO
  // expect(isWellKnownPlatformDomain('//twitter.com')).toBe(true)
  expect(isWellKnownPlatformDomain('medium.com')).toBe(true)
  expect(isWellKnownPlatformDomain('reddit.com')).toBe(true)
  expect(isWellKnownPlatformDomain('instagram.com')).toBe(true)
  expect(isWellKnownPlatformDomain('crunchbase.com/foo/bar')).toBe(true)
  expect(isWellKnownPlatformDomain('www.crunchbase.com/foo/bar')).toBe(true)
  expect(isWellKnownPlatformDomain('www.yahoo.com')).toBe(true)
  expect(isWellKnownPlatformDomain('www.substack.com')).toBe(true)
  expect(isWellKnownPlatformDomain('x.com')).toBe(true)
  expect(isWellKnownPlatformDomain('www.x.com')).toBe(true)
  expect(isWellKnownPlatformDomain('angel.co')).toBe(true)
  expect(isWellKnownPlatformDomain('lnkd.in')).toBe(true)
  expect(isWellKnownPlatformDomain('en.wikipedia.org')).toBe(true)
  expect(isWellKnownPlatformDomain('de.wikipedia.org')).toBe(true)
  expect(isWellKnownPlatformDomain('cn.wikipedia.org')).toBe(true)
  expect(isWellKnownPlatformDomain('foo.bar.wikipedia.org')).toBe(true)
  expect(isWellKnownPlatformDomain('foo.bar.baz.wikipedia.org')).toBe(true)

  expect(isWellKnownPlatformDomain('bob.com')).toBe(false)
  expect(isWellKnownPlatformDomain('transitivebullsh.it')).toBe(false)
  expect(isWellKnownPlatformDomain('foo.co.uk')).toBe(false)

  expect(isWellKnownPlatformDomain('')).toBe(false)
  expect(isWellKnownPlatformDomain('foo')).toBe(false)
  expect(isWellKnownPlatformDomain('.')).toBe(false)
})

test('isCrunchbaseProfileUrl', () => {
  // Valid URLs
  expect(
    isCrunchbaseProfileUrl('https://www.crunchbase.com/person/john-doe')
  ).toBe(true)
  expect(
    isCrunchbaseProfileUrl('https://crunchbase.com/person/jane-smith')
  ).toBe(true)
  expect(
    isCrunchbaseProfileUrl('https://www.crunchbase.com/organization/acme-corp')
  ).toBe(true)
  expect(
    isCrunchbaseProfileUrl('https://crunchbase.com/organization/startup-inc')
  ).toBe(true)

  // Valid URLs with type checking
  expect(
    isCrunchbaseProfileUrl('https://www.crunchbase.com/person/john-doe', {
      type: 'person'
    })
  ).toBe(true)
  expect(
    isCrunchbaseProfileUrl(
      'https://www.crunchbase.com/organization/acme-corp',
      { type: 'company' }
    )
  ).toBe(true)

  // Invalid URLs
  expect(isCrunchbaseProfileUrl()).toBe(false)
  expect(isCrunchbaseProfileUrl('')).toBe(false)
  expect(isCrunchbaseProfileUrl('not-a-url')).toBe(false)
  expect(isCrunchbaseProfileUrl('https://example.com/person/john')).toBe(false)
  expect(isCrunchbaseProfileUrl('https://crunchbase.com/invalid/path')).toBe(
    false
  )
  expect(isCrunchbaseProfileUrl('https://crunchbase.com/person/')).toBe(false)

  // Type mismatch
  expect(
    isCrunchbaseProfileUrl('https://www.crunchbase.com/person/john-doe', {
      type: 'company'
    })
  ).toBe(false)
  expect(
    isCrunchbaseProfileUrl(
      'https://www.crunchbase.com/organization/acme-corp',
      { type: 'person' }
    )
  ).toBe(false)
})

test('isWikidataUrl', () => {
  // Valid URLs
  expect(isWikidataUrl('https://www.wikidata.org/wiki/Q42')).toBe(true)
  expect(isWikidataUrl('https://wikidata.org/wiki/Q12345')).toBe(true)
  expect(isWikidataUrl('https://www.wikidata.org/wiki/Q999999')).toBe(true)

  // Invalid URLs
  expect(isWikidataUrl()).toBe(false)
  expect(isWikidataUrl('')).toBe(false)
  expect(isWikidataUrl('not-a-url')).toBe(false)
  expect(isWikidataUrl('https://example.com/wiki/Q42')).toBe(false)
  expect(isWikidataUrl('https://wikidata.org/not-wiki/Q42')).toBe(false)
  expect(isWikidataUrl('https://wikidata.org/wiki/P42')).toBe(false)
  expect(isWikidataUrl('https://wikidata.org/wiki/')).toBe(false)
  expect(isWikidataUrl('https://wikidata.org/wiki/NotQ42')).toBe(false)
})

test('isGitHubUrl', () => {
  // Valid URLs
  expect(isGitHubUrl('https://github.com/username')).toBe(true)
  expect(isGitHubUrl('https://github.com/username/repo')).toBe(true)
  expect(isGitHubUrl('https://gist.github.com/username')).toBe(true)
  expect(
    isGitHubUrl('https://raw.githubusercontent.com/username/repo/main/file.txt')
  ).toBe(true)

  // Invalid URLs
  expect(isGitHubUrl()).toBe(false)
  expect(isGitHubUrl('')).toBe(false)
  expect(isGitHubUrl('not a url')).toBe(false)
  expect(isGitHubUrl('https://example.com')).toBe(false)
  expect(isGitHubUrl('https://github.com')).toBe(false)
  expect(isGitHubUrl('https://github.com/')).toBe(false)
})

test('getGitHubUsername', () => {
  // Valid usernames
  expect(getGitHubUsername('https://github.com/username')).toBe('username')
  expect(getGitHubUsername('https://github.com/User-Name')).toBe('user-name')
  expect(getGitHubUsername('https://github.com/user123')).toBe('user123')
  expect(getGitHubUsername('https://github.com/a-b-c')).toBe('a-b-c')
  expect(getGitHubUsername('https://github.com/a-b-c/123')).toBe('a-b-c')

  // Invalid cases
  expect(getGitHubUsername()).toBeUndefined()
  expect(getGitHubUsername('')).toBeUndefined()
  expect(getGitHubUsername('not a url')).toBeUndefined()
  expect(getGitHubUsername('https://example.com')).toBeUndefined()
  expect(getGitHubUsername('https://github.com')).toBeUndefined()
  expect(getGitHubUsername('https://github.com/')).toBeUndefined()
  expect(getGitHubUsername('https://github.com/-invalid')).toBeUndefined()
  expect(getGitHubUsername('https://github.com/invalid-')).toBeUndefined()
  expect(
    getGitHubUsername(
      'https://github.com/too-long-username-that-exceeds-39-characters'
    )
  ).toBeUndefined()
})

test('isGravatarUrl', () => {
  // Valid URLs
  expect(isGravatarUrl('https://gravatar.com/username')).toBe(true)
  expect(isGravatarUrl('https://www.gravatar.com/username')).toBe(true)
  expect(isGravatarUrl('https://gravatar.com/username/additional/path')).toBe(
    true
  )
  expect(isGravatarUrl('http://gravatar.com/username')).toBe(true)

  // Invalid URLs
  expect(isGravatarUrl()).toBe(false)
  expect(isGravatarUrl('')).toBe(false)
  expect(isGravatarUrl('https://example.com/username')).toBe(false)
  expect(isGravatarUrl('https://gravatar.com/')).toBe(false)
  expect(isGravatarUrl('https://gravatar.com')).toBe(false)
  expect(isGravatarUrl('gravatar.com/username')).toBe(false) // Not a valid URL
  expect(isGravatarUrl('https://gravatar.com.fake/username')).toBe(false)
  expect(isGravatarUrl('invalid-url')).toBe(false)
  expect(isGravatarUrl('https://gravatar.com/avatar/123')).toBe(false)
})

test('getGravatarUsername', () => {
  // Valid URLs
  expect(getGravatarUsername('https://gravatar.com/username')).toBe('username')
  expect(getGravatarUsername('https://www.gravatar.com/username')).toBe(
    'username'
  )
  expect(
    getGravatarUsername('https://gravatar.com/username/additional/path')
  ).toBe('username')
  expect(getGravatarUsername('http://gravatar.com/username')).toBe('username')

  // Invalid URLs
  expect(getGravatarUsername()).toBe(undefined)
  expect(getGravatarUsername('')).toBe(undefined)
  expect(getGravatarUsername('https://example.com/username')).toBe(undefined)
  expect(getGravatarUsername('https://gravatar.com/')).toBe(undefined)
  expect(getGravatarUsername('https://gravatar.com')).toBe(undefined)
  expect(getGravatarUsername('invalid-url')).toBe(undefined)
})

test('getGravatarUri', () => {
  // Valid URLs
  expect(getGravatarUri('https://gravatar.com/username')).toBe(
    'gravatar.com/username'
  )
  expect(getGravatarUri('https://www.gravatar.com/username')).toBe(
    'gravatar.com/username'
  )
  expect(getGravatarUri('https://gravatar.com/username/additional/path')).toBe(
    'gravatar.com/username'
  )
  expect(getGravatarUri('http://gravatar.com/username')).toBe(
    'gravatar.com/username'
  )

  // Invalid URLs
  expect(getGravatarUri()).toBe(undefined)
  expect(getGravatarUri('')).toBe(undefined)
  expect(getGravatarUri('https://example.com/username')).toBe(undefined)
  expect(getGravatarUri('https://gravatar.com/')).toBe(undefined)
  expect(getGravatarUri('https://gravatar.com')).toBe(undefined)
  expect(getGravatarUri('invalid-url')).toBe(undefined)
})
