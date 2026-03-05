/**
 * API and WebSocket configuration
 * 
 * Set these in .env for your deployment:
 * - VITE_API_URL: Backend REST API base URL (e.g. https://your-app.railway.app)
 * - VITE_WS_URL: WebSocket signaling URL (e.g. wss://your-app.railway.app)
 * 
 * When deploying backend to Railway/Render (for WebSocket support),
 * use the same host for both - e.g. https://mindvista-backend.railway.app
 */

const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL
  if (url) {
    const base = url.replace(/\/+$/, '') // trim trailing slashes
    return base.endsWith('/api') ? base : `${base}/api`
  }
  // Fallback: Vercel backend (REST works, WebSocket does NOT)
  return 'https://mind-vista-backend.vercel.app/api'
  // return 'http://localhost:3000/api'


}

const getWsUrl = () => {
  const url = import.meta.env.VITE_WS_URL
  if (url) return url
  // Derive from API URL if only VITE_API_URL is set
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) {
    const ws = apiUrl.replace(/^https?:\/\//, 'wss://').replace(/\/api\/?$/, '')
    return ws
  }
  // Fallback: Vercel (WebSocket will fail - deploy to Railway/Render for video calls)
  return 'wss://mind-vista-backend.vercel.app'
}

export const API_BASE_URL = getApiBaseUrl()
export const WS_BASE_URL = getWsUrl()
export const API_HOST = API_BASE_URL.replace(/\/api\/?$/, '')
