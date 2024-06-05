export const resolveUrl = (url: string) => {
  const resolver = new UrlResolver([['ipfs://', IPFS_URL]])

  return resolver.resolveUrl(url)
}

// TODO refactor this when below classes will be published in own repo

export class UrlConverter {
  protected destination: string
  protected match?: RegExp | string

  constructor(destination: string | URL, match?: RegExp | string) {
    this.destination =
      destination instanceof URL ? destination.toString() : destination
    if (this.destination.slice(-1) !== '/') {
      this.destination += '/'
    }
    this.match = match
  }

  resolveUrl(_match: RegExp | string, url: string): string {
    const match = this.match || _match
    return url.replaceAll(match, this.destination.toString())
  }
}

export class UrlResolver {
  private converters: Array<{
    match: string | RegExp
    converter: UrlConverter
  }> = []
  constructor(converters: Array<[string | RegExp, UrlConverter | string]>) {
    for (const item of converters) {
      const [match, _converter] = item
      if (match === undefined) {
        throw new TypeError('Match criteria not defined')
      }
      const converter =
        typeof _converter === 'string'
          ? new UrlConverter(_converter)
          : _converter
      if (!(converter instanceof UrlConverter)) {
        throw new TypeError('Invalid converter')
      }
      this.converters.push({ match, converter })
    }
  }

  resolveUrl(_url: string): string {
    const current = new Set<{
      match: string | RegExp
      converter: UrlConverter
    }>(this.converters)
    let found = true
    let url = _url

    while (found) {
      found = false
      for (const entry of current) {
        const { match, converter } = entry
        if (match instanceof RegExp ? match.test(url) : url.startsWith(match)) {
          url = converter.resolveUrl(match, url)
          // This converter matches, so don't use it again.
          current.delete(entry)
          found = true
          break
        }
      }
    }

    return url
  }
}
