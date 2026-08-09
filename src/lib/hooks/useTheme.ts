import { useThemeStore } from '@/src/state/themeStore';
import { themes } from '@/src/styles/themes';

export const useTheme = () => {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return {
        theme,
        toggleTheme,
        activeTheme: themes[theme],
    };
};
