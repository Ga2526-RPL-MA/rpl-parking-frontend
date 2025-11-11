import { create } from "zustand";
import { createJSONStorage,persist } from "zustand/middleware";

import { removeToken, setToken } from "@/lib/cookies";

import { User, WithToken } from "@/types/user";

type useAuthStoreType = {
  user: User | null;
  isAuthed: boolean;
  isLoaded: boolean;
  login: (user: User & WithToken) => void;
  logout: () => void;
  setLoaded: () => void;
};

export const useAuthStore = create<useAuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      isAuthed: false,
      isLoaded: false,

      login: (user) => {
        setToken(user.token);
        set({
          user,
          isAuthed: true,
        });
      },

      logout: () => {
        removeToken();
        localStorage.removeItem("conation");
        set({
          user: null,
          isAuthed: false,
        });
      },

      setLoaded: () => set({ isLoaded: true }),
    }),
    {
      name: "rpl-parking",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoaded();
        }
      },
    }
  )
);
