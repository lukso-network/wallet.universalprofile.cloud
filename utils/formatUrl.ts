import { IPFS_URL } from '@/shared/config'

/**
 * Replaces protocol in the given URL with their respective gateway URLs.
 * If the URL does not contain either protocol, returns the original URL.
 *
 * @param {string} url - The URL to format.
 * @returns {string} The formatted URL.
 */
export function formatUrl(url: string): string {
  // IPFS
  if (url && url.includes('ipfs://')) {
    return url.replace('ipfs://', IPFS_URL)
  }

  return url
}
