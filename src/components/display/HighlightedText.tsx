import React, { useMemo } from 'react';

import Text, { TextVariant, TextType } from '#/Text';

import { useTheme } from '@/src/lib/hooks/useTheme';

interface HighlightedTextProps {
    text: string;
    highlight: string;
    variant?: TextVariant;
    weight?: 'regular' | 'medium' | 'bold';
    type?: TextType;
    numberOfLines?: number;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
    text,
    highlight,
    variant = 'body_Large',
    weight,
    type = 'primary',
    numberOfLines,
}) => {
    const { activeTheme } = useTheme();
    // Mémorisation de la découpe pour éviter les recalculs inutiles
    const parts = useMemo(() => {
        const trimmed = highlight ? highlight.trim() : '';
        if (!trimmed) return null;
        const escapedHighlight = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Ne pas utiliser 'g' pour le match individuel pour éviter les bugs de lastIndex
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        return text.split(regex);
    }, [text, highlight]);
    // Cas simple : pas de recherche
    if (!parts) {
        return (
            <Text variant={variant} weight={weight} type={type} numberOfLines={numberOfLines}>
                {text}
            </Text>
        );
    }
    const lowerHighlight = highlight.trim().toLowerCase();
    return (
        <Text variant={variant} weight={weight} type={type} numberOfLines={numberOfLines}>
            {parts.map((part: any, i: any) => {
                const isMatch = part.toLowerCase() === lowerHighlight;
                return isMatch ? (
                    <Text
                        key={i}
                        variant={variant}
                        weight={weight}
                        style={{
                            backgroundColor: activeTheme.colors.surface.brandSecondary ?? 'yellow',
                        }}
                    >
                        {part}
                    </Text>
                ) : (
                    part
                );
            })}
        </Text>
    );
};
export default React.memo(HighlightedText);
