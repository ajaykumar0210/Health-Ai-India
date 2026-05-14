import { create } from 'zustand';

const MOCK_DOCTOR = {
  id: 'doc_001',
  name: 'Dr. Priya Sharma',
  email: 'dr.priya@healthai-india.com',
  specialization: 'Dermatologist & Hair Specialist',
  avatar: null,
  rating: 4.8,
  totalConsultations: 1240,
};

export const useAuth = create((set) => ({
  isAuthenticated: false,
  doctor: null,
  token: null,

  login: async (email, password) => {
    // Mock login — replace with real API call
    if (email && password) {
      set({ isAuthenticated: true, doctor: MOCK_DOCTOR, token: 'mock_jwt_token' });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  logout: () => set({ isAuthenticated: false, doctor: null, token: null }),
}));
