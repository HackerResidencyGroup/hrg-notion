import hashObjectImpl, { type Options as HashObjectOptions } from 'hash-object'

/**
 * Creates a hash of an object using SHA-256 algorithm by default.
 *
 * @param object - The object to hash
 * @param options - Optional hash config options
 * @returns The hashed string in HEX format
 */
export function hashObject(
  object: Record<string, any>,
  options?: HashObjectOptions
): string {
  return hashObjectImpl(object, { algorithm: 'sha256', ...options })
}
