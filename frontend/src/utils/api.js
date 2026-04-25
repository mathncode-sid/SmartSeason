import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/_/backend/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password, firstName, lastName, role) =>
    api.post('/auth/register', { email, password, firstName, lastName, role }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const fieldsAPI = {
  getAll: () => api.get('/fields'),
  getById: (id) => api.get(`/fields/${id}`),
  create: (name, cropType, plantingDate) =>
    api.post('/fields', { name, cropType, plantingDate }),
  update: (id, data) =>
    api.put(`/fields/${id}`, data),
  delete: (id) =>
    api.delete(`/fields/${id}`),
};

export const updatesAPI = {
  create: (fieldId, stage, notes) =>
    api.post('/updates', { fieldId, stage, notes }),
  getByField: (fieldId) =>
    api.get(`/updates/field/${fieldId}`),
  getMyUpdates: () =>
    api.get('/updates/agent/my-updates'),
};

export const assignmentsAPI = {
  assign: (fieldId, agentId) =>
    api.post('/assignments', { fieldId, agentId }),
  unassign: (fieldId, agentId) =>
    api.delete(`/assignments/${fieldId}/${agentId}`),
  getByField: (fieldId) =>
    api.get(`/assignments/field/${fieldId}`),
  getAgents: () =>
    api.get('/assignments/agents/list'),
};

export const dashboardAPI = {
  getData: () =>
    api.get('/dashboard'),
};

export default api;
