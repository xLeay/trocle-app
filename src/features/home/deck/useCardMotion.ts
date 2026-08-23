import { useMemo } from 'react';
import {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

import { CARD_SWIPE_DEGREE } from './deck.config';

export const useCardMotion = (
    initialScale: number,
    screenWidth: number
) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(initialScale);

    const animatedStyle = useAnimatedStyle(() => {
        const rotation = interpolate(
            translateX.value,
            [-screenWidth, 0, screenWidth],
            [-CARD_SWIPE_DEGREE, 0, CARD_SWIPE_DEGREE],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotation}deg` },
                { scale: scale.value },
            ],
        };
    }, [screenWidth]);

    return useMemo(
        () => ({
            translateX,
            translateY,
            scale,
            animatedStyle,
        }),
        [
            translateX,
            translateY,
            scale,
            animatedStyle,
        ]
    );
};

export type CardMotion = ReturnType<typeof useCardMotion>;