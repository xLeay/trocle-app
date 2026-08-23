import { useCallback, useEffect, useState } from 'react';
import {
    cancelAnimation,
    Easing,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { IMAGE_DURATION } from './deck.config';

interface UseImageCarouselParams {
    productId?: string;
    imageCount: number;
}

export const useImageCarousel = ({
    productId,
    imageCount,
}: UseImageCarouselParams) => {
    const progress = useSharedValue(0);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [restartKey, setRestartKey] = useState(0);

    const restart = useCallback(() => {
        setRestartKey(previous => previous + 1);
    }, []);

    const reset = useCallback(() => {
        cancelAnimation(progress);
        progress.value = 0;

        setCurrentImageIndex(0);
        setRestartKey(previous => previous + 1);
    }, [progress]);

    const goToNext = useCallback(() => {
        cancelAnimation(progress);
        progress.value = 0;

        if (imageCount <= 1) {
            return;
        }

        setCurrentImageIndex(previous =>
            previous < imageCount - 1
                ? previous + 1
                : 0
        );
    }, [imageCount, progress]);

    const goToPrevious = useCallback(() => {
        cancelAnimation(progress);
        progress.value = 0;

        setCurrentImageIndex(previous =>
            previous > 0
                ? previous - 1
                : previous
        );

        restart();
    }, [progress, restart]);

    useEffect(() => {
        cancelAnimation(progress);
        progress.value = 0;

        if (!productId || imageCount <= 1) {
            return;
        }

        progress.value = withTiming(
            1,
            {
                duration: IMAGE_DURATION,
                easing: Easing.linear,
            },
            finished => {
                if (finished) {
                    scheduleOnRN(goToNext);
                }
            }
        );

        return () => {
            cancelAnimation(progress);
        };
    }, [
        productId,
        imageCount,
        currentImageIndex,
        restartKey,
        goToNext,
        progress,
    ]);

    return {
        currentImageIndex,
        progress,
        goToNext,
        goToPrevious,
        restart,
        reset,
    };
};