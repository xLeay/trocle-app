import { createContext, useContext } from 'react';

import { themes } from '@/src/styles/themes';

type ThemeName = keyof typeof themes;

const ThemeScopeContext = createContext<ThemeName | undefined>(undefined);

export function ThemeScope({
    theme,
    children,
}: {
    theme: ThemeName;
    children: React.ReactNode;
}) {
    return (
        <ThemeScopeContext.Provider value={theme}>
            {children}
        </ThemeScopeContext.Provider>
    );
}

export function useScopedThemeName() {
    return useContext(ThemeScopeContext);
}