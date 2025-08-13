import { describe, expect, test } from 'vitest'

import { isRelativeUrl, normalizeUrl, uriToUrl, urlToUri } from './url-utils'

describe('uriToUrl', () => {
  test('should convert valid URI to URL', () => {
    expect(uriToUrl('example.com')).toBe('https://example.com/')
    expect(uriToUrl('example.com/path')).toBe('https://example.com/path')
    expect(uriToUrl('sub.example.com/path')).toBe(
      'https://sub.example.com/path'
    )
    expect(uriToUrl('https://example.com')).toBe('https://example.com')
  })

  test('should handle undefined input', () => {
    expect(uriToUrl(undefined)).toBeUndefined()
  })

  test('should handle empty string', () => {
    expect(uriToUrl('')).toBeUndefined()
  })

  test('should handle malformed URIs', () => {
    expect(uriToUrl('not a uri')).toBeUndefined()
    expect(uriToUrl('http://')).toBeUndefined()
  })
})

describe('urlToUri', () => {
  test('should convert valid URLs to URIs', () => {
    expect(urlToUri('https://example.com')).toBe('example.com')
    expect(urlToUri('https://example.com/')).toBe('example.com')
    expect(urlToUri('https://example.com/path')).toBe('example.com/path')
    expect(urlToUri('https://sub.example.com/path')).toBe(
      'sub.example.com/path'
    )
  })

  test('should strip www prefix', () => {
    expect(urlToUri('https://www.example.com')).toBe('example.com')
    expect(urlToUri('https://www.example.com/path')).toBe('example.com/path')
  })

  test('should handle URIs as input', () => {
    expect(urlToUri('example.com')).toBe('example.com')
    expect(urlToUri('example.com/path')).toBe('example.com/path')
  })

  test('should handle undefined input', () => {
    expect(urlToUri(undefined)).toBeUndefined()
  })

  test('should handle empty string', () => {
    expect(urlToUri('')).toBeUndefined()
  })

  test('should handle malformed URLs', () => {
    expect(urlToUri('not a url')).toBeUndefined()
    expect(urlToUri('http://')).toBeUndefined()
  })

  test('should strip trailing slashes', () => {
    expect(urlToUri('https://example.com/')).toBe('example.com')
    expect(urlToUri('https://example.com/path/')).toBe('example.com/path')
    expect(urlToUri('https://example.com/path//')).toBe('example.com/path')
  })
})

describe('normalizeUrl', () => {
  test('should normalize URLs correctly with default options', () => {
    expect(normalizeUrl('https://www.example.com')).toBe(
      'https://www.example.com'
    )
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
    expect(normalizeUrl('example.com/path/')).toBe('https://example.com/path')
    expect(normalizeUrl('example.com?utm_source=test&ref=123')).toBe(
      'https://example.com'
    )
  })

  test('should handle options correctly', () => {
    expect(normalizeUrl('https://www.example.com', { stripWWW: false })).toBe(
      'https://www.example.com'
    )
    expect(
      normalizeUrl('http://example.com:80', { removeExplicitPort: false })
    ).toBe('http://example.com')
    expect(
      normalizeUrl('example.com/path/', { removeTrailingSlash: false })
    ).toBe('https://example.com/path/')
  })

  test('should handle sloppy URIs', () => {
    expect(normalizeUrl('example.com', { allowSloppyUris: true })).toBe(
      'https://example.com'
    )
    expect(
      normalizeUrl('example.com', { allowSloppyUris: false })
    ).toBeUndefined()
  })

  test('should handle invalid inputs', () => {
    expect(normalizeUrl()).toBeUndefined()
    expect(normalizeUrl('')).toBeUndefined()
    expect(normalizeUrl('not a url')).toBeUndefined()
    expect(normalizeUrl('http://')).toBeUndefined()
  })
})

describe('isRelativeUrl', () => {
  test('should identify relative URLs correctly', () => {
    expect(isRelativeUrl('/path')).toBe(true)
    expect(isRelativeUrl('./path')).toBe(true)
    expect(isRelativeUrl('../path')).toBe(true)
    expect(isRelativeUrl('path')).toBe(true)
  })

  test('should identify absolute URLs correctly', () => {
    expect(isRelativeUrl('https://example.com')).toBe(false)
    expect(isRelativeUrl('https://example.com/foo/bar')).toBe(false)
    expect(isRelativeUrl('http://example.com')).toBe(false)
    expect(isRelativeUrl('//example.com')).toBe(false)
    expect(isRelativeUrl('ftp://example.com')).toBe(false)
  })

  test('should handle invalid inputs', () => {
    expect(isRelativeUrl('')).toBe(false)
    // @ts-expect-error Testing invalid input
    expect(isRelativeUrl()).toBe(false)
    // @ts-expect-error Testing invalid input
    expect(isRelativeUrl(null)).toBe(false)
  })
})
