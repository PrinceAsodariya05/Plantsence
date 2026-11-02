import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 90000
});
export async function identifyPlant(file, sessionId, signal) {
  const body = new FormData();
  body.append('image', file);
  body.append('sessionId', sessionId);
  const response = await api.post('/plants/identify', body, { signal });
  return response.data.data;
}
export async function fetchHistory(sessionId) {
  const response = await api.get('/plants/history', { params: { sessionId } });
  return response.data.data;
}
