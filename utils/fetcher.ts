/**
 * Generic url fetcher.
 *
 * @param string url - an url to call
 * @param string address - a method used in the request, either 'GET' or 'POST'
 * @param Request data - a request data to be sent
 * @param Record headers - additional headers to be sent
 * @returns a result from calling the url
 * @throws - throws if response is not 20*
 */
export const fetcher = async <Response, Request>(config: {
  url: string
  method: 'GET' | 'POST'
  data?: Request
  headers?: Record<string, string>
}): Promise<Response> => {
  const fetchConfig: RequestInit = {
    method: config.method,
    headers: config.headers || {
      Accept: 'application/json',
      ...(config.data ? { 'Content-Type': 'application/json' } : {})
    },
    redirect: 'follow'
  }
  if (config.data) {
    fetchConfig.body = JSON.stringify(config.data)
  }

  const response = await fetch(config.url, fetchConfig)

  if (!response.ok) {
    let text: any = (await response.text()) || response.statusText
    if (text) {
      try {
        text = JSON.parse(text)
        text = text.message || text.error || text
      } catch {
        // Ignore
      }
      throw new Error(text)
    }
  }
  return await response.json()
}
