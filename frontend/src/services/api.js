import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  createLink: (data) => axios.post(`${API_BASE}/api/links`, data),
  getAllLinks: () => axios.get(`${API_BASE}/api/links`),
  getLinkStats: (code) => axios.get(`${API_BASE}/api/links/${code}`),
  deleteLink: (code) => axios.delete(`${API_BASE}/api/links/${code}`),
  healthCheck: () => axios.get(`${API_BASE}/healthz`)
};