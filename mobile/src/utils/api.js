import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  setupProfile: (data) => api.post('/auth/profile', data),
  getProfile: () => api.get('/auth/profile'),
};

export const symptomsAPI = {
  chat: (message, concerns, sessionId) =>
    api.post('/symptoms/chat', { message, concerns, sessionId }),
  rootCause: (concerns, symptoms) =>
    api.post('/symptoms/root-cause', { concerns, symptoms }),
};

export const doctorsAPI = {
  list: (concern) => api.get(`/doctors?concern=${concern}`),
  getById: (id) => api.get(`/doctors/${id}`),
  bookAppointment: (data) => api.post('/consultations/book', data),
  getConsultations: () => api.get('/consultations'),
  getPrescription: (id) => api.get(`/consultations/${id}/prescription`),
};

export const subscriptionsAPI = {
  createOrder: (planId) => api.post('/subscriptions/create-order', { planId }),
  verify: (data) => api.post('/subscriptions/verify', data),
  getCurrent: () => api.get('/subscriptions/current'),
  cancel: () => api.delete('/subscriptions/current'),
};

export const progressAPI = {
  getLogs: () => api.get('/progress'),
  addLog: (data) => api.post('/progress', data),
  getDashboard: () => api.get('/progress/dashboard'),
  getMilestones: () => api.get('/progress/milestones'),
};

export default api;
