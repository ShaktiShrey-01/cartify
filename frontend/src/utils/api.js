// NEW: Centralized backend API base URL + helpers.
// Keeps all product pages consistent and avoids hard-coding 8000 everywhere.
// Always use backend for API calls in dev
// Use relative path so Vite proxy handles API requests and cookies work for session auth
export const API_BASE = ''

// NEW: Backend responses are wrapped as { statuscode, data, message, success }.
// This helper extracts the actual payload so existing UI can keep using arrays/objects.
export const unwrapApiResponse = (json) => {
  if (json && typeof json === 'object' && 'data' in json) return json.data
  return json
}
