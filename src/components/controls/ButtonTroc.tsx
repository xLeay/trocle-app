import React, { act, forwardRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/hooks/useTheme';

import { Close, Heart, Refresh } from '#/icons';

export type ButtonType = 'pass' | 'like' | 'reroll';
export type ButtonColor = 'mono' | 'default';

interface ButtonProps {
    onPress?: () => void;
    disabled?: boolean;
    type?: ButtonType;
    color?: ButtonColor;
}

const ButtonTroc = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(({
    onPress,
    disabled = false,
    type = 'pass',
    color = 'default',
    ...rest
}, ref) => {
    const { activeTheme } = useTheme();
    const [isPressed, setIsPressed] = useState(false);

    const scale = useSharedValue(1);
    const pressedValue = useSharedValue(0);

    const handlePressIn = () => {
        if (!disabled) {
            setIsPressed(true);
            pressedValue.value = withTiming(1, { duration: 250 });
            scale.value = withSpring(0.985, { stiffness: 800 });
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            setIsPressed(false);
            pressedValue.value = withTiming(0, { duration: 250 });
            scale.value = withSpring(1, { stiffness: 800 });
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        if (disabled) {
            return {
                transform: [{ scale: 1 }],
                backgroundColor: activeTheme.colors.component.button.disabled,
            };
        }

        return {
            transform: [{ scale: scale.value }],
            backgroundColor: interpolateColor(
                pressedValue.value,
                [0, 1],
                [
                    activeTheme.colors.surface.primary,
                    activeTheme.colors.surface.divider
                ]
            ),
        };
    });

    const withAlpha = (hex: string, alpha: number) => {
        const hexClean = hex.replace('#', '');
        const r = hexClean.slice(0, 2);
        const g = hexClean.slice(2, 4);
        const b = hexClean.slice(4, 6);
        const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}${a}`;
    };

    const iconColor =
        color === 'mono'
            ? activeTheme.colors.icon.primary
            : color === 'default'
                ? type === 'reroll'
                    ? activeTheme.colors.icon.yellow
                    : activeTheme.colors.surface.contrast

                : activeTheme.colors.surface.contrast;

    const iconGradient =
        type === 'pass'
            ? activeTheme.colors.gradient.tertiaryGradient
            : type === 'like'
                ? activeTheme.colors.gradient.primaryGradient
                : activeTheme.colors.gradient.tertiaryGradient;

    const baseButtonStyles = [
        styles.button,
        type === 'pass' ? styles.largeTrocButton :
            type === 'like' ? styles.largeTrocButton :
                type === 'reroll' ? styles.smallTrocButton :
                    null
    ];

    const shadowButtonStyles = [
        color !== 'mono' && (
            type === 'pass' ? { boxShadow: `0px 1px 10px 2px ${withAlpha(activeTheme.colors.surface.accent, 0.15)}` } :
                type === 'like' ? { boxShadow: `0px 1px 10px 2px ${withAlpha(activeTheme.colors.surface.brand, 0.15)}` } :
                    type === 'reroll' ? { boxShadow: `0px 1px 10px 1px ${withAlpha(activeTheme.colors.icon.yellow, 0.15)}` } :
                        null
        ),
    ];

    const getIconProps = () => {
        if (color === 'mono') {
            return { color: activeTheme.colors.icon.primary }
        }
        return { gradient: iconGradient };
    };

    return (
        <Animated.View style={[styles.animatedView, animatedStyle, shadowButtonStyles]}>
            <Pressable
                ref={ref}
                style={baseButtonStyles}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                {...rest}
            >
                <View style={[styles.content]}>
                    {type === 'pass' ? (
                        <Close size={40} {...getIconProps()} />
                    ) : type === 'like' ? (
                        <Heart size={40} filled {...getIconProps()} />
                    ) : (
                        <Refresh size={24} color={iconColor} />
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
});

export default ButtonTroc;

const styles = StyleSheet.create({
    animatedView: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 56 / 2,

        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.25)",
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,

        // borderWidth: 1,
        // borderColor: 'red',
    },
    content: {
        // borderWidth: 1,
        // borderColor: 'green',
    },
    largeTrocButton: {
        height: 56,
        width: 56,
    },
    smallTrocButton: {
        height: 40,
        width: 40,
    },
})