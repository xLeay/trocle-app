import React, { forwardRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { styles } from '@/src/styles/chips.styles';

import Text from '#/Text';

interface IconProps {
    color?: string;
    fill?: string;
}

export type ChipStyle = 'mono' | 'outlined' | 'gradientPrimary' | 'gradientTertiary'

export type IconPosition = 'left' | 'right' | 'only';

export interface ChipProps {
    onPress?: () => void;
    onLongPress?: () => void;
    label?: string;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    disabled?: boolean;
    loading?: boolean;
    chipStyle?: ChipStyle;
    large?: boolean;
    selected?: boolean;
    fullWidth?: boolean;
}

const ANIMATION_DURATION = 150;
const STIFFNESS = 1200;
const SCALE_PRESS = 0.95;

const Chip = forwardRef<React.ComponentRef<typeof Pressable>, ChipProps>(({
    onPress,
    onLongPress,
    label,
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    chipStyle = 'mono',
    large = false,
    selected = false,
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
            pressedValue.value = withTiming(1, { duration: ANIMATION_DURATION });
            scale.value = withSpring(SCALE_PRESS, { stiffness: STIFFNESS });
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            setIsPressed(false);
            pressedValue.value = withTiming(0, { duration: ANIMATION_DURATION });
            scale.value = withSpring(1, { stiffness: STIFFNESS });
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
            backgroundColor:
                chipStyle === 'gradientPrimary' || chipStyle === 'gradientTertiary'
                    ? 'transparent'
                    : chipStyle === 'mono'
                        ? selected
                            ? activeTheme.colors.component.chip.monoSelected
                            : activeTheme.colors.component.chip.mono
                        : selected
                            ? activeTheme.colors.component.chip.outlinedSelected
                            : activeTheme.colors.surface.primary,
        };
    });

    const textColor = disabled
        ? activeTheme.colors.surface.field
        : chipStyle === 'mono' || chipStyle === 'outlined' || chipStyle === 'gradientPrimary' || chipStyle === 'gradientTertiary' ? (
            selected
                ? activeTheme.colors.text.invert
                : activeTheme.colors.text.primary
        ) : activeTheme.colors.text.primary;

    const iconColor = textColor;

    const baseChipStyles = [
        styles.chip,
        isIconOnly ? (
            large ? styles.largeIconChip :
                styles.smallIconChip
        ) : (
            large ? styles.largeChipDefault :
                styles.smallChipDefault
        ),
    ];

    const radiusStyles =
        isIconOnly ? (
            large ? styles.largeIconChipRadius : styles.smallIconChipRadius
        ) : (
            large ? styles.largeChipRadius : styles.smallChipRadius
        );

    const variantChipStyles = [
        radiusStyles,
        chipStyle === 'outlined' && !disabled && !selected && {
            outlineWidth: 1,
            outlineColor: activeTheme.colors.component.chip.outlined,
        },
    ];

    const contentStyles = [
        styles.content,
        fullWidth && styles.fullWidth,
        iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
    ];

    const gradientColors = chipStyle === 'gradientPrimary' ? [
        activeTheme.colors.gradient.primaryGradient.colors[0],
        activeTheme.colors.gradient.primaryGradient.colors[1]
    ] : chipStyle === 'gradientTertiary' ? [
        activeTheme.colors.gradient.tertiaryGradient.colors[0],
        activeTheme.colors.gradient.tertiaryGradient.colors[1]
    ] : [];

    const gradientPressableStyle =
        chipStyle === 'gradientPrimary' || chipStyle === 'gradientTertiary'
            ? {
                margin: selected ? 0 : 1,
                // Si non sélectionné, le Pressable masque le centre avec la couleur de fond 
                // tout en gardant exactement le même borderRadius réduit de 1px (ou identique)
                borderRadius: radiusStyles.borderRadius ? radiusStyles.borderRadius - (selected ? 0 : 1) : undefined,
                backgroundColor: selected
                    ? 'transparent'
                    : activeTheme.colors.surface.primary,
                zIndex: 1,
            }
            : undefined;


    const isGradient =
        chipStyle === 'gradientPrimary' || chipStyle === 'gradientTertiary';

    return (
        <Animated.View style={[
            styles.animatedView,
            fullWidth && { flex: 1, width: '100%' },
            animatedStyle,
            variantChipStyles,
            isGradient && { overflow: 'hidden' },
        ]}>

            {isGradient && (
                <LinearGradient
                    pointerEvents="none"
                    colors={[gradientColors[0], gradientColors[1]]}
                    style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                />
            )}
            <Pressable
                ref={ref}
                style={[
                    baseChipStyles,
                    fullWidth && styles.fullWidth,
                    gradientPressableStyle
                ]}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                {...rest}
            >

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
                        <Text
                            variant={large ? 'title_Small' : 'label_Large'}
                            containerStyle={{ marginHorizontal: large ? activeTheme.spacing._100 : 0 }}
                            style={{ color: textColor }}
                        >
                            {label}
                        </Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
});

export default Chip;
