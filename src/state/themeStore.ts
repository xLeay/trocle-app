import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage'

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    version: number;
    initialized: boolean;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'light',
    version: 0,
    initialized: false,

    toggleTheme: () => {
        set((state) => {
            const theme = state.theme === "light" ? "dark" : "light";
            void AsyncStorage.setItem("theme", theme);

            return { theme };
        });
    },

    setTheme: (theme) => {
        AsyncStorage.setItem('theme', theme)
        set({ theme, version: Math.random(), initialized: true })
    },

    loadTheme: async () => {
        const savedTheme = await AsyncStorage.getItem('theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
            set({ theme: savedTheme, initialized: true })
        } else {
            set({ initialized: true })
        }
    },
}))
