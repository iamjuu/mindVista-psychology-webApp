const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const base = url.replace(/\/+$/, ''); // trim trailing slashes
  return base.endsWith('/api') ? base : `${base}/api`;
};

const getWsUrl = () => {
  const url = import.meta.env.VITE_WS_URL;
  if (url) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const ws = apiUrl
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://')
    .replace(/\/api\/?$/, '');
  return ws;
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsUrl();
export const API_HOST = API_BASE_URL.replace(/\/api\/?$/, '');
