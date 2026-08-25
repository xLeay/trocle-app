import { getFontScale, getTextSize } from "./fonts";
import { color } from "./primitives";
import { fontSize, lineHeight, radius, spacing } from './tokens';

type Theme = 'light' | 'dark';

export function createThemes() {
    // Éléments communs aux deux thèmes
    const commonThemeProps = {
        typography,
        spacing,
        radius
    };

    // Fonction pour créer un thème avec les couleurs spécifiques
    const createTheme = (mode: Theme) => ({
        colors: {
            surface: surface[mode],
            text: text[mode],
            border: border[mode],
            icon: icon[mode],
            component: component[mode],
            gradient: gradient[mode]
        },
        ...commonThemeProps
    });

    return {
        light: createTheme('light'),
        dark: createTheme('dark')
    };
}

const surface = {
    light: {
        primary: color.neutral._100,
        secondary: color.neutral._99,
        brand: color.primary._40,
        brandLight: color.primary._95,
        brandContrast: color.primary._30,
        brandSecondary: color.secondary._50,
        brandSecondaryLight: color.secondary._90,
        accent: color.accent._40,
        accentLight: color.accent._90,
        accentSecondary: color.accentSecondary._50,
        accentSecondaryLight: color.accentSecondary._90,
        blue: color.blue._50,
        blueLight: color.blue._90,
        danger: color.danger._50,
        dangerLight: color.danger._90,
        success: color.success._40,
        successLight: color.success._90,
        alert: color.alert._40,
        alertLight: color.alert._90,
        neutral: color.neutral._50,
        neutralLight: color.neutral._90,
        transparent: 'rgba(0, 0, 0, 0.4)',
        transparentContrast: 'rgba(255, 255, 255, 0.4)',
        transparentMenu: 'rgba(252, 252, 253, 0.75)',
        contrast: color.neutral._0,
        contrastSecondary: color.neutral._30,
        divider: color.neutral._90,
        field: color.neutral._70,
    },
    dark: {
        primary: color.neutral._15,
        secondary: color.neutral._10,
        brand: color.primary._40,
        brandLight: color.primary._15,
        brandContrast: color.primary._30,
        brandSecondary: color.secondary._50,
        brandSecondaryLight: color.secondary._40,
        accent: color.accent._70,
        accentLight: color.accent._40,
        accentSecondary: color.accentSecondary._60,
        accentSecondaryLight: color.accentSecondary._40,
        blue: color.blue._70,
        blueLight: color.blue._40,
        danger: color.danger._70,
        dangerLight: color.danger._40,
        success: color.success._70,
        successLight: color.success._40,
        alert: color.alert._70,
        alertLight: color.alert._40,
        neutral: color.neutral._70,
        neutralLight: color.neutral._40,
        transparent: 'rgba(255, 255, 255, 0.4)',
        transparentContrast: 'rgba(0, 0, 0, 0.4)',
        transparentMenu: 'rgba(24, 25, 27, 0.75)',
        contrast: color.neutral._100,
        contrastSecondary: color.neutral._70,
        divider: color.neutral._20,
        field: color.neutral._60,
    }
}

const text = {
    light: {
        primary: color.neutral._10,
        secondary: color.neutral._40,
        placeholder: color.neutral._60,
        invert: color.neutral._100,
        brand: surface.light.brand,
        success: surface.light.success,
        danger: surface.light.danger,
        warning: surface.light.alert,
        info: surface.light.blue,
        neutral: surface.light.neutral,
    },
    dark: {
        primary: color.neutral._90,
        secondary: color.neutral._70,
        placeholder: color.neutral._50,
        invert: color.neutral._0,
        brand: surface.dark.brand,
        success: surface.dark.success,
        danger: surface.dark.danger,
        warning: surface.dark.alert,
        info: surface.dark.blue,
        neutral: surface.dark.neutral,
    }
}

const border = {
    light: {
        primary: surface.light.divider,
        primary35: 'rgba(228, 229, 231, 0.35)',
        secondary: surface.light.field,
        brand: surface.light.brand,
        blue: surface.light.blue,
        danger: surface.light.danger,
    },
    dark: {
        primary: surface.dark.divider,
        primary35: 'rgba(48, 50, 54, 0.35)',
        secondary: surface.dark.field,
        brand: surface.dark.brand,
        blue: surface.dark.blue,
        danger: surface.dark.danger,
    }
}

const icon = {
    light: {
        primary: surface.light.contrast,
        invert: surface.light.primary,
        brand: surface.light.brand,
        brandSecondary: surface.light.brandSecondary,
        accent: surface.light.accent,
        accentSecondary: surface.light.accentSecondary,
        blue: surface.light.blue,
        danger: surface.light.danger,
        success: surface.light.success,
        alert: surface.light.alert,
        yellow: color.alert._50,
    },
    dark: {
        primary: surface.dark.contrast,
        invert: surface.dark.primary,
        brand: surface.dark.brand,
        brandSecondary: surface.dark.brandSecondary,
        accent: surface.dark.accent,
        accentSecondary: surface.dark.accentSecondary,
        blue: surface.dark.blue,
        danger: surface.dark.danger,
        success: surface.dark.success,
        alert: surface.dark.alert,
        yellow: color.alert._50,
    }
}

const component = {
    light: {
        searchBar: {
            background: surface.light.divider
        },
        messageBar: {
            background: surface.light.divider
        },
        button: {
            primary: surface.light.brand,
            primaryPressed: surface.light.brandContrast,
            secondary: surface.light.contrast,
            secondaryPressed: surface.light.contrastSecondary,
            tertiary: surface.light.divider,
            tertiaryPressed: surface.light.field,
            outlined: surface.light.divider,
            outlinedPressed: surface.light.transparent,
            ghost: surface.light.brand,
            ghostPressed: surface.light.brandContrast,
            disabled: surface.light.divider
        },
        chip: {
            mono: surface.light.divider,
            monoSelected: surface.light.contrast,
            outlined: surface.light.divider,
            outlinedSelected: surface.light.brand,
        }
    },
    dark: {
        searchBar: {
            background: surface.dark.divider
        },
        messageBar: {
            background: surface.dark.divider
        },
        button: {
            primary: surface.dark.brand,
            primaryPressed: surface.dark.brandContrast,
            secondary: surface.dark.contrast,
            secondaryPressed: surface.dark.contrastSecondary,
            tertiary: surface.dark.divider,
            tertiaryPressed: surface.dark.field,
            outlined: surface.dark.divider,
            outlinedPressed: surface.dark.transparent,
            ghost: surface.dark.brand,
            ghostPressed: surface.dark.brandContrast,
            disabled: surface.dark.divider
        },
        chip: {
            mono: surface.dark.divider,
            monoSelected: surface.dark.contrast,
            outlined: surface.dark.divider,
            outlinedSelected: surface.dark.brand,
        }
    }
}

const gradient = {
    light: {
        // primaryGradient: `linear-gradient(180deg, ${surface.light.brand} 0%, ${surface.light.brandSecondary} 100%)`,
        // tertiaryGradient: `linear-gradient(180deg, ${surface.light.accent} 0%, ${surface.light.accentSecondary} 100%)`,
        primaryGradient: {
            colors: [surface.light.brandSecondary, surface.light.brand],
            positions: [0, 1],
        },
        tertiaryGradient: {
            colors: [surface.light.accentSecondary, surface.light.accent],
            positions: [0, 1],
        },
    },
    dark: {
        // primaryGradient: `linear-gradient(180deg, ${surface.dark.brand} 0%, ${surface.dark.brandSecondary} 100%)`,
        // tertiaryGradient: `linear-gradient(180deg, ${surface.dark.accent} 0%, ${surface.dark.accentSecondary} 100%)`,
        primaryGradient: {
            colors: [surface.dark.brandSecondary, surface.dark.brand],
            positions: [0, 1],
        },
        tertiaryGradient: {
            colors: [surface.dark.accentSecondary, surface.dark.accent],
            positions: [0, 1],
        },
    }
}

const typography = {
    // Display
    display_Large: {
        fontFamily: 'RethinkSans-Bold',
        fontSize: getTextSize(fontSize._4xl, getFontScale()),
        lineHeight: lineHeight._4xl,
        letterSpacing: -1,
    },
    display_Medium: {
        fontFamily: 'RethinkSans-Bold',
        fontSize: getTextSize(fontSize._3xl, getFontScale()),
        lineHeight: lineHeight._3xl,
        letterSpacing: -1,
    },
    display_Small: {
        fontFamily: 'RethinkSans-Bold',
        fontSize: getTextSize(fontSize._2xl, getFontScale()),
        lineHeight: lineHeight._2xl,
        letterSpacing: -1,
    },
    // Title
    title_Large: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize.xl, getFontScale()),
        lineHeight: lineHeight.xl,
        letterSpacing: -1,
    },
    title_Medium: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize.lg, getFontScale()),
        lineHeight: lineHeight.lg,
        letterSpacing: -1,
    },
    title_Small: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize.md, getFontScale()),
        lineHeight: lineHeight.md,
        letterSpacing: -1,
    },
    // Body
    body_Large: {
        fontFamily: 'RethinkSans-Regular',
        fontSize: getTextSize(fontSize.md, getFontScale()),
        lineHeight: lineHeight.md,
        letterSpacing: 0,
    },
    body_Medium: {
        fontFamily: 'RethinkSans-Regular',
        fontSize: getTextSize(fontSize.sm, getFontScale()),
        lineHeight: lineHeight.sm,
        letterSpacing: 0,
    },
    body_Small: {
        fontFamily: 'RethinkSans-Regular',
        fontSize: getTextSize(fontSize.xs, getFontScale()),
        lineHeight: lineHeight.xs,
        letterSpacing: 0,
    },
    // Label
    label_Large: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize.sm, getFontScale()),
        lineHeight: lineHeight.sm,
        letterSpacing: 0,
    },
    label_Medium: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize.xs, getFontScale()),
        lineHeight: lineHeight.xs,
        letterSpacing: 0,
    },
    label_Small: {
        fontFamily: 'RethinkSans-Medium',
        fontSize: getTextSize(fontSize._2xs, getFontScale()),
        lineHeight: lineHeight.xs,
        letterSpacing: 0,
    },
    // Button
    button_Large: {
        fontFamily: 'RethinkSans-Bold',
        fontSize: getTextSize(fontSize.md, getFontScale()),
        lineHeight: lineHeight.md,
        letterSpacing: 0,
    }
}