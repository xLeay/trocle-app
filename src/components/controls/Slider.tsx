import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Tooltip from '#/display/Tooltip';

interface SliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    sliderWidth?: number;
}

const CONTAINER_HEIGHT = 40;
const THUMB_SIZE = 28;

export default function Slider({
    min,
    max,
    value,
    onChange,
    disabled = false,
    sliderWidth = 300,
}: SliderProps) {

    const { activeTheme } = useTheme();

    const range = max - min;
    const position = useSharedValue(((value - min) / range) * sliderWidth);
    const [isActive, setIsActive] = useState(false);

    // Synchroniser la position quand la valeur change
    useEffect(() => {
        const newPosition = ((value - min) / range) * sliderWidth;
        position.value = withTiming(newPosition);
    }, [value, min, max, range]);

    const gesture = Gesture.Pan()
        .enabled(!disabled)
        .onStart(() => runOnJS(setIsActive)(true))
        .onChange((event) => {
            const newX = Math.min(Math.max(0, position.value + event.changeX), sliderWidth);
            position.value = newX;
            const newValue = min + (newX / sliderWidth) * range;
            runOnJS(onChange)(Math.round(newValue));
        })
        .onEnd(() => runOnJS(setIsActive)(false));

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value - THUMB_SIZE / 2 },
            { translateY: -(CONTAINER_HEIGHT - THUMB_SIZE) }
        ],
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: position.value,
    }));

    const haloStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 0.7 : 1, { duration: 200 }),
        transform: [
            { scale: withTiming(isActive ? (CONTAINER_HEIGHT / THUMB_SIZE) : 1, { duration: 200 }) },
            // { translateY: -(CONTAINER_HEIGHT - THUMB_SIZE) }
        ]
    }));

    const tooltipStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
        transform: [{ scale: withTiming(isActive ? 1 : 0.5, { duration: 200 }) }],
    }));

    const valueFromPosition = (pos: number) => min + (pos / sliderWidth) * range;

    return (
        <Flex
            border
            alignItems='center'
            justifyContent='center'
            style={[styles.wrapper, { width: sliderWidth + THUMB_SIZE, height: CONTAINER_HEIGHT }]}>
            <Flex
                style={[
                    styles.track,
                    {
                        backgroundColor: disabled ? activeTheme.colors.surface.field : activeTheme.colors.surface.divider,
                        width: sliderWidth,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: disabled ? activeTheme.colors.surface.brandLight : activeTheme.colors.surface.brand,
                        },
                        fillStyle,
                    ]}
                />

                {!disabled && (
                    <GestureDetector gesture={gesture}>
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

                            {isActive && (
                                <>
                                    <Animated.View
                                        style={[
                                            styles.thumbHalo,
                                            haloStyle,
                                            {
                                                backgroundColor: activeTheme.colors.surface.brand
                                            },
                                        ]}
                                    />


                                    {/* <Animated.Text style={[styles.tooltip, tooltipStyle]}>
                                            {Math.round(valueFromPosition(position.value))}
                                        </Animated.Text> */}
                                </>
                            )}

                        </Animated.View>
                    </GestureDetector>
                )}
            </Flex>
        </Flex>
    );
}

const styles = StyleSheet.create({
    wrapper: {},
    track: {
        height: 4,
        borderRadius: 2,
    },
    fill: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        left: 0,
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        zIndex: 2,
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
    tooltip: {
        position: 'absolute',
        top: -35,
        color: '#444',
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        minWidth: 30,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
});