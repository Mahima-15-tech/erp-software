import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { server } from '../constants/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,
      token: null,
      user: null,
      isUserLoading: true,

      login: (role, token, user = null) =>
        set({ isAuthenticated: true, role, token, user, isUserLoading: false }),

      logout: () =>
        set({ isAuthenticated: false, role: null, token: null, user: null, isUserLoading: false }),

      fetchUser: async () => {
        try {
          const { data } = await axios.get(`${server}/me`, { withCredentials: true });
          console.log("✅ User fetched:", data.user); // optional debug
          set({
            isAuthenticated: true,
            role: data.user.role,
            user: data.user,
            isUserLoading: false,
          });
        } catch (error) {
          console.log("❌ User fetch failed:", error.message); // optional debug
          set({ isAuthenticated: false, role: null, user: null, isUserLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,

      // 👇 Add rehydration hook
      onRehydrateStorage: () => (state) => {
        state.fetchUser(); // ✅ call only after store is rehydrated
      }
    }
  )
);
