
import React, { useMemo } from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface GradientProps {
    colors: string[]; // Liste des couleurs du dégradé
    positions?: number[]; // Liste des positions (entre 0 et 1, optionnel)
}

interface IconProps {
    size?: number;
    color?: ColorValue;
    filled?: boolean;
    gradient?: GradientProps;
    style?: object;
}

export interface BrandIconProps {
    size?: number;
    color?: ColorValue; // Si fourni, remplace la couleur/fill par défaut
    style?: object;
}

// Fonction pour les icônes avec un seul path (single path)
export function createSinglePathSVG({
    filledPath,
    strokePath,
}: {
    filledPath: string;
    strokePath: string;
}) {
    const SinglePathSVG: React.FC<IconProps> = ({
        size = 24,
        color = 'black',
        filled = false,
        gradient,
        style,
    }) => {
        const path = filled ? filledPath : strokePath;
        const gradientId = useMemo(() => `gradient-${Math.random().toString(36).slice(2, 9)}`, []);

        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
                {gradient && (
                    <Defs>
                        <LinearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
                            {gradient.colors.map((color, index) => (
                                <Stop
                                    key={index}
                                    offset={
                                        gradient.positions
                                            ? `${gradient.positions[index] * 100}%`
                                            : `${(index / (gradient.colors.length - 1)) * 100}%`
                                    }
                                    stopColor={color}
                                />
                            ))}
                        </LinearGradient>
                    </Defs>
                )}
                <Path
                    fill={gradient ? `url(#${gradientId})` : color}
                    fillRule="evenodd"
                    d={path}
                    clipRule="evenodd"
                />
            </Svg>
        );
    };

    return React.memo(SinglePathSVG);
}

// Fonction pour les icônes avec plusieurs paths (multiple paths)
export function createMultiPathSVG({
    filledPaths,
    strokePaths,
}: {
    filledPaths: string[];
    strokePaths: string[];
}) {
    const MultiPathSVG: React.FC<IconProps> = ({
        size = 24,
        color = 'black',
        filled = false,
        gradient,
        style,
    }) => {
        const paths = filled ? filledPaths : strokePaths;
        const gradientId = useMemo(() => `gradient-${Math.random().toString(36).slice(2, 9)}`, []);

        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
                {gradient && (
                    <Defs>
                        <LinearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
                            {gradient.colors.map((color, index) => (
                                <Stop
                                    key={index}
                                    offset={
                                        gradient.positions
                                            ? `${gradient.positions[index] * 100}%`
                                            : `${(index / (gradient.colors.length - 1)) * 100}%`
                                    }
                                    stopColor={color}
                                />
                            ))}
                        </LinearGradient>
                    </Defs>
                )}
                {paths.map((path, index) => (
                    <Path
                        key={index}
                        fill={gradient ? `url(#${gradientId})` : color}
                        fillRule="evenodd"
                        d={path}
                        clipRule="evenodd"
                    />
                ))}
            </Svg>
        );
    };

    return React.memo(MultiPathSVG);
}

// Fonction pour les logos de marque
export function createBrandSVG({
    viewBox = '0 0 24 24',
    renderContent,
}: {
    viewBox?: string;
    renderContent: (color?: ColorValue) => React.ReactNode;
}) {
    const BrandSVG: React.FC<BrandIconProps> = ({
        size = 24,
        color,
        style,
    }) => {
        return (
            <Svg width={size} height={size} viewBox={viewBox} fill="none" style={style}>
                {renderContent(color)}
            </Svg>
        );
    };
    return React.memo(BrandSVG);
}