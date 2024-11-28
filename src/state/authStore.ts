import { create } from 'zustand';


interface AuthState {
    isAuthenticated: boolean;
    user: any;
    login: (user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
    isAuthenticated: false,
    user: null,
    login: (user: any) => set({ isAuthenticated: true, user }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));
