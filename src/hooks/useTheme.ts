import { useThemeStore } from '@/src/state/themeStore';
import { themes } from '@/src/styles/themes';

export const useTheme = () => {
    const { theme, toggleTheme } = useThemeStore(); // Récupère l'état depuis Zustand
    const activeTheme = themes[theme]; // Trouve le thème actif en fonction de l'état

    return { theme, toggleTheme, activeTheme };
};
