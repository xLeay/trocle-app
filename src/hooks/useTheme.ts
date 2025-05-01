import { useThemeStore } from '@/src/state/themeStore';
import { themes } from '@/src/styles/themes';
import { useEffect, useState } from 'react';

export const useTheme = () => {
    const { theme, toggleTheme, version } = useThemeStore();
    const [activeTheme, setActiveTheme] = useState(themes[theme]);

    useEffect(() => {
        setActiveTheme(themes[theme]);
    }, [theme, version]);

    return { theme, toggleTheme, activeTheme, version };
};