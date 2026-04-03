import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  tenantId: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

interface HydrationState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ── Persisted store: token + user only ──
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        setCookie("auth-storage", JSON.stringify({ state: { token, user } }));
        set({ token, user });
      },
      logout: () => {
        deleteCookie("auth-storage");
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Re-sync cookie on rehydration
        if (state?.token && state?.user) {
          setCookie("auth-storage", JSON.stringify({ state: { token: state.token, user: state.user } }));
        }
        // Signal hydration complete on the separate store
        useHydrationStore.getState().setHasHydrated(true);
      },
    },
  ),
);

// ── Separate non-persisted store for hydration flag ──
// This is NEVER stored in localStorage so it always starts false
// and is reliably set to true once rehydration completes
export const useHydrationStore = create<HydrationState>()((set) => ({
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
}));
