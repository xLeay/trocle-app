import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
    cancelAnimation,
    Extrapolation,
    interpolate,
    SharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
    CardLayer,
    NEXT_CARD_SCALE,
    SCALE_DURATION,
    SWIPE_DURATION,
    SWIPE_THRESHOLD_RATIO,
    SWIPE_THRESHOLD_VELOCITY,
    SwipeAction,
    WIDTH_MULTIPLIER,
} from './deck.config';
import { CardMotion } from './useCardMotion';

interface UseCardPanGestureParams {
    layer: CardLayer;
    enabled: boolean;
    screenWidth: number;
    motion: CardMotion;
    nextCardScale: SharedValue<number>;
    imageProgress: SharedValue<number>;
    isCardExiting: SharedValue<boolean>;
    restartImageProgress: () => void;
    onComplete: (
        layer: CardLayer,
        action: SwipeAction
    ) => void;
}

export const useCardPanGesture = ({
    layer,
    enabled,
    screenWidth,
    motion,
    nextCardScale,
    imageProgress,
    isCardExiting,
    restartImageProgress,
    onComplete,
}: UseCardPanGestureParams) => {
    return useMemo(
        () =>
            Gesture.Pan()
                .enabled(enabled)
                .activeOffsetX([-10, 10])
                .failOffsetY([-20, 20])

                .onBegin(() => {
                    if (isCardExiting.value) {
                        return;
                    }

                    cancelAnimation(imageProgress);
                })

                .onUpdate(event => {
                    if (isCardExiting.value) {
                        return;
                    }

                    motion.translateX.value = event.translationX;

                    const swipeProgress = interpolate(
                        Math.abs(event.translationX),
                        [
                            0,
                            screenWidth * SWIPE_THRESHOLD_RATIO,
                        ],
                        [0, 1],
                        Extrapolation.CLAMP
                    );

                    nextCardScale.value = interpolate(
                        swipeProgress,
                        [0, 1],
                        [NEXT_CARD_SCALE, 1],
                        Extrapolation.CLAMP
                    );
                })

                .onEnd(event => {
                    if (isCardExiting.value) {
                        return;
                    }

                    const isVelocitySwipe =
                        Math.abs(event.velocityX) >=
                        SWIPE_THRESHOLD_VELOCITY;

                    const isDistanceSwipe =
                        Math.abs(event.translationX) >=
                        screenWidth * SWIPE_THRESHOLD_RATIO;

                    const didSwipe =
                        isVelocitySwipe || isDistanceSwipe;

                    if (!didSwipe) {
                        motion.translateX.value = withSpring(0);

                        nextCardScale.value = withSpring(
                            NEXT_CARD_SCALE
                        );

                        return;
                    }

                    isCardExiting.value = true;

                    const isRight = isVelocitySwipe
                        ? event.velocityX > 0
                        : event.translationX > 0;

                    const action: SwipeAction = isRight
                        ? 'like'
                        : 'pass';

                    const exitPosition = isRight
                        ? screenWidth * WIDTH_MULTIPLIER
                        : -screenWidth * WIDTH_MULTIPLIER;

                    nextCardScale.value = withTiming(1, {
                        duration: SCALE_DURATION,
                    });

                    motion.translateX.value = withTiming(
                        exitPosition,
                        { duration: SWIPE_DURATION },
                        finished => {
                            if (finished) {
                                scheduleOnRN(
                                    onComplete,
                                    layer,
                                    action
                                );
                            }
                        }
                    );
                })

                .onFinalize(() => {
                    if (!isCardExiting.value) {
                        scheduleOnRN(restartImageProgress);
                    }
                }),
        [
            layer,
            enabled,
            screenWidth,
            motion,
            nextCardScale,
            imageProgress,
            isCardExiting,
            restartImageProgress,
            onComplete,
        ]
    );
};