import { useThemeStore } from '@/src/state/themeStore';
import { themes } from '@/src/styles/themes';
import { useEffect, useState } from 'react';

export const useTheme = () => {
    const { theme, toggleTheme, version, initialized, loadTheme } = useThemeStore();
    const [activeTheme, setActiveTheme] = useState(themes[theme]);

    useEffect(() => {
        if (!initialized) {
            loadTheme()
        }
    }, [initialized])

    useEffect(() => {
        setActiveTheme(themes[theme])
    }, [theme, version])

    return { theme, toggleTheme, activeTheme, version, initialized };
};