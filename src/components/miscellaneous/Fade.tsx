import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/src/lib/hooks/useTheme';

type FadeSide = 'top' | 'bottom' | 'left' | 'right';

interface FadeProps {
    side: FadeSide;
    height?: number; // pour top/bottom
    width?: number;  // pour left/right
    color?: string;
}

const Fade: React.FC<FadeProps> = ({
    side,
    height = 40,
    width = 40,
    color,
}) => {
    const { activeTheme } = useTheme();
    
    const isVertical = side === 'top' || side === 'bottom';
    const isTopOrLeft = side === 'top' || side === 'left';

    const gradientProps = {
        x1: isVertical ? '0%' : isTopOrLeft ? '100%' : '0%',
        y1: isVertical ? (isTopOrLeft ? '100%' : '0%') : '0%',
        x2: isVertical ? '0%' : isTopOrLeft ? '0%' : '100%',
        y2: isVertical ? (isTopOrLeft ? '0%' : '100%') : '0%',
    };

    const fadeColor = color ?? activeTheme.colors.surface.secondary;

    return (
        <Svg
            style={[
                styles.base,
                side === 'top' && styles.top,
                side === 'bottom' && styles.bottom,
                side === 'left' && styles.left,
                side === 'right' && styles.right,
                isVertical ? { height, width: '100%' } : { width, height: '100%' },
            ]}
        >
            <Defs>
                <LinearGradient id="fadeGradient" {...gradientProps}>
                    <Stop offset="0" stopColor={fadeColor} stopOpacity="0" />
                    <Stop offset="1" stopColor={fadeColor} stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Rect
                width="100%"
                height="100%"
                fill="url(#fadeGradient)"
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        pointerEvents: 'none',
    },
    top: { top: 0, left: 0, right: 0 },
    bottom: { bottom: 0, left: 0, right: 0 },
    left: { left: 0, top: 0, bottom: 0 },
    right: { right: 0, top: 0, bottom: 0 },
});

export default Fade;
