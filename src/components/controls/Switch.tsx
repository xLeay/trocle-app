import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

// Durée et easing communs aux deux animations
const ANIM_CONFIG = {
    duration: 150,
    easing: Easing.out(Easing.quad),
    reduceMotion: ReduceMotion.System,
};

// Déplacement du thumb en pixels (largeur du track - padding*2 - taille du thumb = 56 - 8 - 24)
const THUMB_TRAVEL = 24;

interface SwitchProps {
    checked?: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

const Switch = ({ checked, onValueChange, disabled = false }: SwitchProps) => {
    const { activeTheme } = useTheme();

    // --- Mode contrôlé / non-contrôlé ---
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(checked ?? false);
    const currentValue = isControlled ? checked : internalChecked;

    // --- Valeurs animées ---
    const thumbAnim = useSharedValue(currentValue ? 1 : 0);
    const bgAnim = useSharedValue(currentValue ? 1 : 0);

    // Sync des animations quand currentValue change (contrôlé ou non-contrôlé)
    useEffect(() => {
        thumbAnim.value = withTiming(currentValue ? 1 : 0, ANIM_CONFIG);
        bgAnim.value = withTiming(currentValue ? 1 : 0, ANIM_CONFIG);
    }, [currentValue]);

    // --- Styles animés ---
    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: thumbAnim.value * THUMB_TRAVEL }],
    }));

    const backgroundStyle = useAnimatedStyle(() => {
        const [offColor, onColor] = disabled
            ? [activeTheme.colors.surface.divider, activeTheme.colors.surface.brandLight]
            : [activeTheme.colors.surface.field, activeTheme.colors.surface.brand];

        return {
            backgroundColor: interpolateColor(bgAnim.value, [0, 1], [offColor, onColor]),
        };
    });

    // --- Handler ---
    const handlePress = useCallback(() => {
        if (disabled) return;

        const newValue = !currentValue;

        if (!isControlled) {
            // Mode non-contrôlé : on gère l'état et l'animation ici
            setInternalChecked(newValue);
            thumbAnim.value = withTiming(newValue ? 1 : 0, ANIM_CONFIG);
            bgAnim.value = withTiming(newValue ? 1 : 0, ANIM_CONFIG);
        }
        // Mode contrôlé : le useEffect se chargera de l'animation
        // quand le parent mettra à jour checked

        onValueChange(newValue);
    }, [currentValue, isControlled, disabled, onValueChange]);

    // --- Rendu ---
    return (
        <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={1}>
            <View style={styles.track}>
                <Animated.View style={[styles.background, backgroundStyle]}>
                    <Animated.View style={[styles.thumb, thumbStyle]} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    track: {
        width: 56,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    background: {
        justifyContent: 'center',
        padding: 4,
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
    },
});

export default Switch;
