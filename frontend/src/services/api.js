import axios from 'axios';

const API_BASE = location.hostname === "localhost"? "http://localhost:5000" : import.meta.env.VITE_API_URL

export const api = {
  createLink: (data) => axios.post(`${API_BASE}/api/links`, data),
  getAllLinks: () => axios.get(`${API_BASE}/api/links`),
  getLinkStats: (code) => axios.get(`${API_BASE}/api/links/${code}`),
  deleteLink: (code) => axios.delete(`${API_BASE}/api/links/${code}`),
  healthCheck: () => axios.get(`${API_BASE}/healthz`)
};