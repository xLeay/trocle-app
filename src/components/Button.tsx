import React from 'react';

import { useTheme } from '@/src/hooks/useTheme';
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import Text from '#/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'ghost';
export type ButtonSize = 'small' | 'large';
export type ButtonState = {
    pressed: boolean;
    disabled: boolean;
};

interface ButtonProps {
    label: string;
    onPress?: () => void;
    icon?: React.ReactNode; // L'icône est optionnelle
    iconPosition?: 'left' | 'right'; // Position de l'icône (par défaut à gauche)
    disabled?: boolean; // Si le bouton est désactivé
    variant?: ButtonVariant; // Variante du bouton (par défaut 'primary')
    size?: ButtonSize; // Taille du bouton (par défaut 'small')
    fullWidth?: boolean; // Largeur du bouton (par défaut 'false')
}


const Button: React.FC<ButtonProps> = ({
    label = 'Bouton',
    onPress,
    icon,
    iconPosition = 'left',
    disabled = false,
    variant = 'primary',
    size = 'small',
    fullWidth = false,
}) => {
    const { theme, activeTheme, toggleTheme } = useTheme();

    const scale = useSharedValue(1);
    const pressedValue = useSharedValue(0); // 0 pour "normal", 1 pour "pressed"
    let animatedStyle;

    if (!disabled) {
        animatedStyle = useAnimatedStyle(() => ({
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
                ] : [
                    activeTheme.colors.component.button.disabled,
                    activeTheme.colors.component.button.disabled
                ]
            ),
        }));
    }

    const handlePressIn = () => {
        if (!disabled) {
            pressedValue.value = withTiming(1, { duration: 250 });
            scale.value = withSpring(0.98, { stiffness: 800 });
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            pressedValue.value = withTiming(0, { duration: 250 });
            scale.value = withSpring(1, { stiffness: 800 });
        }
    };

    // Styles en fonction de la variante du bouton
    const variantStyles: ViewStyle[] = []
    const textStyles: TextStyle[] = [styles.text]

    if (!disabled) {
        if (variant === 'primary') {
            textStyles.push({
                color: activeTheme.colors.text.invert
            })
        } else if (variant === 'secondary') {
            textStyles.push({
                color: activeTheme.colors.text.invert
            })
        } else if (variant === 'tertiary') {
            textStyles.push({
                color: activeTheme.colors.surface.contrast
            })
        } else if (variant === 'outlined') {
            variantStyles.push({
                borderWidth: 1,
                borderColor: activeTheme.colors.component.button.outlined
            });
            textStyles.push({
                color: activeTheme.colors.surface.contrast
            })
        } else if (variant === 'ghost') {
            textStyles.push({
                color: activeTheme.colors.component.button.ghost
            })
        }
    } else {
        variantStyles.push({
            backgroundColor: activeTheme.colors.component.button.disabled,
        });
        textStyles.push({
            color: activeTheme.colors.surface.field
        })
    }

    // Styles en fonction de la taille du bouton
    const sizeStyles = size === 'large' ? styles.largeButton : styles.smallButton;

    const radiiStyles = size === 'large' ? styles.largeButtonRadius : styles.smallButtonRadius;
    const fullWidthStyles = fullWidth ? styles.fullWidthButton : null;

    variantStyles.push({
        ...radiiStyles,
        ...fullWidthStyles
    });

    // Application dynamique des styles
    const combinedStyles = [
        styles.button,
        sizeStyles,
    ];

    return (
        <Animated.View style={[styles.animatedView, variantStyles, animatedStyle]}>
            <Pressable
                style={[combinedStyles]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
            >
                <View style={[styles.content, iconPosition === 'left' ? styles.iconLeft : styles.iconRight]}>
                    {icon && <View style={styles.icon}>{icon}</View>}
                    <Text variant='button_Large' style={textStyles}>
                        {label}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    animatedView: {
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeft: {
        flexDirection: 'row',
    },
    iconRight: {
        flexDirection: 'row-reverse',
    },
    icon: {
        // marginRight: 8,
    },
    text: {
        marginInline: 8,
    },

    // Styles pour la taille
    largeButton: {
        minWidth: 120,
        height: 48,
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    largeButtonRadius: {
        borderRadius: 48 * 0.45
    },
    smallButton: {
        minWidth: 90,
        height: 32,
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    smallButtonRadius: {
        borderRadius: 32 * 0.45
    },
    fullWidthButton: {
        width: '100%',
    },
});

export default Button;
