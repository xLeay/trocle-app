import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Tooltip from '#/display/Tooltip';

interface SliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    style?: any;
}

const CONTAINER_HEIGHT = 44;
const THUMB_SIZE = 28;

export default function Slider({
    min,
    max,
    value,
    onChange,
    disabled = false,
    style,
}: SliderProps) {
    const { activeTheme } = useTheme();

    const [trackWidth, setTrackWidth] = useState(0);
    const range = max - min;
    const position = useSharedValue(0);
    const [isActive, setIsActive] = useState(false);

    // Synchronisation instantanée quand la valeur change de l'extérieur (ex: Pinch to zoom)
    useEffect(() => {
        if (trackWidth > 0 && !isActive) {
            const clampedVal = Math.min(Math.max(value, min), max);
            const newPos = ((clampedVal - min) / range) * trackWidth;
            position.value = newPos;
        }
    }, [value, min, max, range, trackWidth, isActive]);

    const onTrackLayout = (e: LayoutChangeEvent) => {
        const { width } = e.nativeEvent.layout;
        setTrackWidth(width);
        const clampedVal = Math.min(Math.max(value, min), max);
        position.value = ((clampedVal - min) / range) * width;
    };

    // Le Pan écoute sur TOUTE la boîte : on peut cliquer/glisser de n'importe où !
    const gesture = Gesture.Pan()
        .enabled(!disabled)
        .onBegin((event) => {
            if (trackWidth <= 0) return;
            scheduleOnRN(setIsActive, true);

            // Clic direct n'importe où sur la barre
            const clampedX = Math.min(Math.max(0, event.x), trackWidth);
            position.value = clampedX;
            const newValue = min + (clampedX / trackWidth) * range;
            scheduleOnRN(onChange, newValue);
        })
        .onChange((event) => {
            if (trackWidth <= 0) return;
            const clampedX = Math.min(Math.max(0, event.x), trackWidth);
            position.value = clampedX;
            const newValue = min + (clampedX / trackWidth) * range;
            // scheduleOnRN(onChange, newValue);
            scheduleOnRN(onChange, Math.round(newValue * 2) / 2);
        })
        .onFinalize(() => {
            scheduleOnRN(setIsActive, false);
        });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value - THUMB_SIZE / 2 }],
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: position.value,
    }));

    const haloStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 0.3 : 0, { duration: 150 }),
        transform: [
            { scale: withTiming(isActive ? 1.428 : 1, { duration: 150 }) },
        ],
    }));

    const tooltipPositionStyle = useAnimatedStyle(() => ({
        left: position.value,
    }));

    return (
        <Flex
            style={[styles.wrapper, style]}
            justifyContent="center"
        >
            <GestureDetector gesture={gesture}>
                <View
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    onLayout={onTrackLayout}
                    style={styles.trackContainer}
                >
                    {/* Barre de fond */}
                    <View
                        style={[
                            styles.track,
                            {
                                backgroundColor: disabled
                                    ? activeTheme.colors.surface.field
                                    : activeTheme.colors.surface.divider,
                            },
                        ]}
                    >
                        {/* Barre remplie */}
                        <Animated.View
                            style={[
                                styles.fill,
                                {
                                    backgroundColor: disabled
                                        ? activeTheme.colors.surface.brandLight
                                        : activeTheme.colors.surface.brand,
                                },
                                fillStyle,
                            ]}
                        />
                    </View>

                    {/* Thumb interactif */}
                    {trackWidth > 0 && (
                        <Animated.View
                            style={[
                                styles.thumb,
                                thumbStyle,
                                {
                                    backgroundColor: disabled
                                        ? activeTheme.colors.surface.brandLight
                                        : activeTheme.colors.surface.brand,
                                },
                            ]}
                        >
                            {!disabled && <Animated.View
                                style={[
                                    styles.thumbHalo,
                                    haloStyle,
                                    {
                                        // backgroundColor: activeTheme.colors.surface.brand,
                                        backgroundColor: disabled
                                            ? activeTheme.colors.surface.brandLight
                                            : activeTheme.colors.surface.brand,
                                    },
                                ]}
                            />
                            }
                        </Animated.View>

                    )}

                    {/* Tooltip */}
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.tooltipAnchor,
                            tooltipPositionStyle,
                        ]}
                    >
                        <Tooltip
                            inline
                            visible={isActive}
                            content={`${value.toFixed(1).replace('.', ',')}`}
                            offset={((THUMB_SIZE * 1.428) / 2) + 4}
                        />
                    </Animated.View>
                </View>
            </GestureDetector>
        </Flex>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, // S'adapte automatiquement à l'espace parent (ou flexShrink)
        height: CONTAINER_HEIGHT,
        justifyContent: 'center',

        // paddingHorizontal pour pas que le thumb soit en dehors de l'écran
        paddingHorizontal: THUMB_SIZE / 2
    },
    trackContainer: {
        width: '100%',
        height: CONTAINER_HEIGHT,
        justifyContent: 'center',
    },
    track: {
        height: 4,
        borderRadius: 2,
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        position: 'absolute',
        left: 0,
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbHalo: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        zIndex: -1,
    },
    tooltipAnchor: {
        position: 'absolute',
        width: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
