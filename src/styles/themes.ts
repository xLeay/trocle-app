import { createThemes } from './styles';

export const themes = {
    ...createThemes(),
};

export type ThemeType = typeof themes.light;
