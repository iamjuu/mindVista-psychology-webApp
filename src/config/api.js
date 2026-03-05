

const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    throw new Error('VITE_API_URL is not defined in .env file')
  }
  const base = url.replace(/\/+$/, '') // trim trailing slashes
  return base.endsWith('/api') ? base : `${base}/api`
}

const getWsUrl = () => {
  const url = import.meta.env.VITE_WS_URL
  if (url) return url
  // Derive from API URL if only VITE_API_URL is set
  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined in .env file')
  }
  const ws = apiUrl.replace(/^https?:\/\//, 'wss://').replace(/\/api\/?$/, '')
  return ws
}

export const API_BASE_URL = getApiBaseUrl()
export const WS_BASE_URL = getWsUrl()
export const API_HOST = API_BASE_URL.replace(/\/api\/?$/, '')
