import { useThemeStore } from '@/src/state/themeStore';
import { themes } from '@/src/styles/themes';
import { useScopedThemeName } from '@/src/lib/providers/ThemeScope';

export const useTheme = () => {
    const storedTheme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const scopedTheme = useScopedThemeName();
    const theme = scopedTheme ?? storedTheme;

    return {
        theme,
        toggleTheme,
        activeTheme: themes[theme],
        isThemeForced: scopedTheme !== undefined,
    };
};
