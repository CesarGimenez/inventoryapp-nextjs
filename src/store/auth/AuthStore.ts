import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  _id: string;
  email: string;
  type: string;
  active: boolean;
  username: string;
  name: string;
  company: any;
}

type AuthStore = {
    user: User | null;
    token: string;
    loading: boolean;
    login: (data: any) => void;
    logout: () => void;
    setUser: (user: any) => void;
    initializeAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: "",
            loading: true,
            login: (data: any) => set({ user: data.user, token: data.token }),
            logout: () => set({ user: null, token: "" }),
            setUser: (user: User) => set({ user }),
            initializeAuth: () => {
                const storedUser = get().user;
                const storedToken = get().token;
                if (storedUser && storedToken) {
                  set({
                    user: storedUser,
                    token: storedToken,
                    loading: false,
                  });
                } else {
                  set({ loading: false });
                }
              },
        }),
        {
            name: "auth",
            storage: createJSONStorage(() => localStorage),
        }
    )   
)