import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import Flex from '#/Flex';

interface SliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    sliderWidth?: number;
}

const THUMB_SIZE = 20;

export default function Slider({
    min,
    max,
    value,
    onChange,
    disabled = false,
    sliderWidth = 300,
}: SliderProps) {
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
        transform: [{ translateX: position.value - THUMB_SIZE / 2 }],
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: position.value,
    }));

    const haloStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
        transform: [{ scale: withTiming(isActive ? 1 : 0.5, { duration: 200 }) }],
    }));

    const tooltipStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
        transform: [{ scale: withTiming(isActive ? 1 : 0.5, { duration: 200 }) }],
    }));

    const valueFromPosition = (pos: number) => min + (pos / sliderWidth) * range;

    return (
        <Flex style={[styles.wrapper, { width: sliderWidth + THUMB_SIZE }]}>
            <Flex
                style={[
                    styles.track,
                    {
                        backgroundColor: disabled ? '#e0e0e0' : '#eee',
                        width: sliderWidth,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: disabled ? '#9e9e9e' : '#00B386',
                        },
                        fillStyle,
                    ]}
                />

                {!disabled && (
                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.thumb, thumbStyle]}>
                            {isActive && (
                                <>
                                    <Animated.View
                                        style={[styles.thumbHalo, haloStyle]}
                                    />
                                    <Animated.Text style={[styles.tooltip, tooltipStyle]}>
                                        {Math.round(valueFromPosition(position.value))}
                                    </Animated.Text>
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
    wrapper: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    track: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#eee',
        justifyContent: 'center',
        position: 'relative',
    },
    fill: {
        height: 6,
        backgroundColor: '#00B386',
        borderRadius: 3,
        position: 'absolute',
        left: 0,
    },
    thumb: {
        position: 'absolute',
        top: -7,
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#00B386',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    thumbHalo: {
        position: 'absolute',
        width: THUMB_SIZE * 2,
        height: THUMB_SIZE * 2,
        borderRadius: THUMB_SIZE,
        backgroundColor: 'rgba(0,179,134,0.3)',
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