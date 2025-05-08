import React, { forwardRef, useState } from 'react';
import { Pressable, View, ViewStyle, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { styles } from '@/src/styles/button.styles';

import Text from '#/Text';

interface IconProps {
    color?: string;
    fill?: string;
}

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'outlined'
    | 'ghost'
    | 'transparent'
    | 'gradient'
    ;

export type ButtonSize = 'small' | 'large' | 'FAB';
export type IconPosition = 'left' | 'right' | 'only';

interface ButtonProps {
    onPress?: () => void;
    onLongPress?: () => void;
    label?: string;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    disabled?: boolean;
    loading?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(({
    onPress,
    onLongPress,
    label, // aucun label par défaut étant donné la présence potentielle d'un bouton icône
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    variant = 'secondary',
    size = 'small',
    fullWidth = false,
    ...rest
}, ref) => {
    const { activeTheme } = useTheme();
    const [isPressed, setIsPressed] = useState(false);

    const scale = useSharedValue(1);
    const pressedValue = useSharedValue(0);

    const hasLabel = !!label;
    const hasIcon = !!icon;
    const isIconOnly = hasIcon && !hasLabel;

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
                variant === 'primary' ? [
                    activeTheme.colors.component.button.primary,
                    activeTheme.colors.component.button.primaryPressed
                ] : variant === 'secondary' ? [
                    activeTheme.colors.component.button.secondary,
                    activeTheme.colors.component.button.secondaryPressed
                ] : variant === 'tertiary' ? [
                    activeTheme.colors.component.button.tertiary,
                    activeTheme.colors.component.button.tertiaryPressed
                ] : variant === 'outlined' ? [
                    activeTheme.colors.surface.secondary,
                    activeTheme.colors.component.button.outlinedPressed
                ] : variant === 'ghost' ? [
                    'transparent',
                    'transparent'
                ] : variant === 'transparent' ? [
                    activeTheme.colors.surface.transparent,
                    activeTheme.colors.surface.transparentContrast
                ] : [
                    activeTheme.colors.component.button.disabled,
                    activeTheme.colors.component.button.disabled
                ]
            ),
        };
    });

    const textColor = disabled
        ? activeTheme.colors.surface.field
        : variant === 'primary'
            ? 'white'
            : variant === 'secondary' || variant === 'transparent' || variant === 'gradient'
                ? activeTheme.colors.text.invert
                : variant === 'ghost'
                    ? activeTheme.colors.component.button.ghost
                    : activeTheme.colors.surface.contrast;

    const iconColor =
        variant === 'ghost' && isIconOnly
            ? isPressed
                ? activeTheme.colors.component.button.secondaryPressed
                : activeTheme.colors.component.button.secondary
            : textColor;

    const baseButtonStyles = [
        styles.button,
        isIconOnly ? (
            size === 'small' ? styles.smallIconButton :
                size === 'large' ? styles.largeIconButton :
                    size === 'FAB' ? styles.FABButton :
                        null
        ) : (
            size === 'small' ? styles.smallButtonDefault :
                size === 'large' ? styles.largeButtonDefault :
                    size === 'FAB' ? styles.FABButton :
                        null
        ),
    ];

    const variantButtonStyles = [
        isIconOnly ? (
            size === 'small' ? styles.smallIconButtonRadius :
                size === 'large' ? styles.largeIconButtonRadius :
                    size === 'FAB' ? styles.FABRadius :
                        null
        ) : (
            size === 'small' ? styles.smallButtonRadius :
                size === 'large' ? styles.largeButtonRadius :
                    size === 'FAB' ? styles.FABRadius :
                        null
        ),

        size === 'FAB' && styles.FABShadow,

        variant === 'outlined' && !disabled && {
            borderWidth: 1,
            borderColor: activeTheme.colors.component.button.outlined,
        },
    ];

    const contentStyles = [
        styles.content,
        fullWidth && styles.fullWidth,
        iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
    ];

    const gradientColors = variant === 'gradient' ? [
        activeTheme.colors.gradient.primaryGradient.colors[0],
        activeTheme.colors.gradient.primaryGradient.colors[1]
    ] : [];


    return (
        <Animated.View style={[styles.animatedView, animatedStyle, variantButtonStyles]}>
            <Pressable
                ref={ref}
                style={baseButtonStyles}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                {...rest}
            >
                {variant === 'gradient' && (
                    <LinearGradient
                        colors={[gradientColors[0], gradientColors[1]]}
                        style={[StyleSheet.absoluteFill, variantButtonStyles, { zIndex: -1 }]}
                    />
                )}

                <View style={contentStyles}>
                    {loading && (
                        <ActivityIndicator size="small" color={textColor} />
                    )}
                    {!loading && hasIcon && iconPosition && (
                        <View style={[hasLabel && styles.iconLeft]}>
                            {React.isValidElement(icon)
                                ? React.cloneElement(icon as React.ReactElement<any>, {
                                    color: (icon.props as IconProps).color ?? iconColor,
                                    fill: (icon.props as IconProps).fill ?? iconColor,
                                })
                                : icon}
                        </View>
                    )}

                    {hasLabel && !isIconOnly && (
                        <Text variant="button_Large" containerStyle={styles.text} style={{ color: textColor }}>
                            {label}
                        </Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
});

export default Button;
