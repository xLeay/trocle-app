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
            const next = state.theme === 'light' ? 'dark' : 'light'
            AsyncStorage.setItem('theme', next)
            return { theme: next, version: state.version + 1 }
        })
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
