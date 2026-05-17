import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAppStore = create((set, get) => ({
  // Auth state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Selected health concerns
  selectedConcerns: [],

  // Subscription
  subscription: null,

  // AI Chat sessions
  chatSessions: {},

  // Progress
  progressLogs: [],
  streaks: 0,

  // Language
  language: 'en', // 'en' | 'hi' | others

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
    set({ token, isAuthenticated: !!token });
  },

  loadAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userRaw = await AsyncStorage.getItem('user_data');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const savedLang = await AsyncStorage.getItem('app_language');
      set({ token, user, isAuthenticated: !!token, isLoading: false, language: savedLang || 'en' });
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    set({ token: null, user: null, isAuthenticated: false, selectedConcerns: [], subscription: null });
  },

  setSelectedConcerns: (concerns) => set({ selectedConcerns: concerns }),

  toggleConcern: (concernId) => {
    const current = get().selectedConcerns;
    const updated = current.includes(concernId)
      ? current.filter((c) => c !== concernId)
      : [...current, concernId];
    set({ selectedConcerns: updated });
  },

  setSubscription: (subscription) => set({ subscription }),

  addChatMessage: (sessionId, message) => {
    const sessions = get().chatSessions;
    const session = sessions[sessionId] || [];
    set({ chatSessions: { ...sessions, [sessionId]: [...session, message] } });
  },

  clearChatSession: (sessionId) => {
    const sessions = { ...get().chatSessions };
    delete sessions[sessionId];
    set({ chatSessions: sessions });
  },

  setProgressLogs: (logs) => set({ progressLogs: logs }),

  addProgressLog: (log) =>
    set({ progressLogs: [log, ...get().progressLogs] }),

  setStreaks: (streaks) => set({ streaks }),

  setLanguage: async (language) => {
    await AsyncStorage.setItem('app_language', language);
    set({ language });
  },
}));

export default useAppStore;
