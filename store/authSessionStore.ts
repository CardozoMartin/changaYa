import { User } from '@/app/types/IUserData.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthSessionState {
  token: string | null;
  user: User | null;
  rehydrated: boolean;
  setRehydrated: (v: boolean) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      rehydrated: false,
      setAuth: (token: string, user: User) => set({ token, user }),
      clearAuth: () => {
        try {
          AsyncStorage.removeItem('auth-session-storage');
        } catch (err) {
        } finally {
          set({ token: null, user: null });
        }
      },
      setRehydrated: (v: boolean) => set({ rehydrated: v }),
    }),
    {
      name: "auth-session-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Marca que la rehidratación terminó para que la app pueda continuar
        state?.setRehydrated(true);
      },
    }
  )
);