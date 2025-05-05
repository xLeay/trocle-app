import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    withSpring,
    useSharedValue,
    useAnimatedStyle,
    interpolateColor,
    withTiming,
    ReduceMotion,
    Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

interface SwitchProps {
    checked?: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

const Switch = ({ checked, onValueChange, disabled = false }: SwitchProps) => {
    const { activeTheme } = useTheme();

    // Animation de la position du bouton
    const thumbPosition = useSharedValue(checked ? 1 : 0);
    const backgroundColor = useSharedValue(checked ? 1 : 0);
    const trueColor = disabled ?
        [activeTheme.colors.surface.divider, activeTheme.colors.surface.brandLight] :
        [activeTheme.colors.surface.field, activeTheme.colors.surface.brand];

    // Animation de la position du "thumb"
    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(thumbPosition.value * 24)
            }],
        };
    });

    // Animation de la couleur de fond
    const backgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backgroundColor.value,
                [0, 1],
                [trueColor[0], trueColor[1]],
            ),
        };
    });

    // Fonction pour gérer le changement de l'état du switch
    const handlePress = useCallback(() => {
        if (!disabled) {
            const newValue = !checked;
            onValueChange(newValue);

            // Animation lorsque l'état change
            thumbPosition.value = withTiming(newValue ? 1 : 0,
                {
                    duration: 0,
                    easing: Easing.out(Easing.quad),
                    reduceMotion: ReduceMotion.System,
                }
            );
            backgroundColor.value = withTiming(newValue ? 1 : 0);
        }
    }, [checked, onValueChange, disabled]);

    return (
        <TouchableOpacity onPress={handlePress} disabled={disabled}>
            <View
                style={{
                    width: 56,
                    height: 32,
                    borderRadius: 16,
                    overflow: 'hidden',
                    justifyContent: 'center',
                }}
            >
                <Animated.View
                    style={[
                        {
                            justifyContent: 'center',
                            padding: 4,
                        },
                        backgroundStyle,
                    ]}
                >
                    <Animated.View
                        style={[
                            {
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: 'white',
                            },
                            thumbStyle,
                        ]}
                    />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

export default Switch;
