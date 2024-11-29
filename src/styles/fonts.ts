import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();

const factor = 0.0625; // Ajustement de base (2% de la taille initiale)

const fontScaleMultipliers: Record<string, number> = {
    '-2': 1 - factor * 3,
    '-1': 1 - factor * 2,
    '0': 1 - factor * 1,   // Valeur par défaut
    '1': 1,
    '2': 1 + factor * 1,
};

export function computeFontScaleMultiplier(scale: string) {
    return fontScaleMultipliers[scale] || fontScaleMultipliers['0']; // Valeur par défaut
}

export function getTextSize(fontSize: number, scale: string) {
    const multiplier = computeFontScaleMultiplier(scale);
    return fontSize * multiplier; // Retourne la taille de texte ajustée en fonction de l'échelle
}

export function getFontScale() {
    return fontScale.toString() ?? '0';  // Retourne '0' si la mise à l'échelle n'est pas définie
}

