import { create } from 'zustand';

export const useAdminAuth = create((set) => ({
  isAuthenticated: false,
  admin: null,

  login: async (email, password) => {
    if (email && password) {
      set({
        isAuthenticated: true,
        admin: { name: 'Admin User', email, role: 'Super Admin' },
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  logout: () => set({ isAuthenticated: false, admin: null }),
}));
