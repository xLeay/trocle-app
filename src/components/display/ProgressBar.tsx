import { useTheme } from '@/src/lib/hooks/useTheme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
    progress: number; // de 0 à 1
    type?: 'primary' | 'mono';
    height?: number;
    innerColor?: string;
    outerColor?: string;
    style?: ViewStyle;
    isActive?: boolean;
}

const ProgressBar = ({
    progress = 0,
    type = 'primary',
    height = 4,
    innerColor,
    outerColor,
    style,
    isActive = false,
}: ProgressBarProps) => {
    const { activeTheme } = useTheme();
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 50,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolated = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const outerColorx = outerColor ?? (type === 'mono' ? activeTheme.colors.border.primary35 : activeTheme.colors.surface.divider);
    const innerColorx = innerColor ?? (type === 'mono' ? activeTheme.colors.surface.primary : activeTheme.colors.surface.brand);


    return (
        <View style={[styles.outerBar, { height, borderRadius: height / 2, backgroundColor: outerColorx }, style]}>
            <Animated.View
                style={[styles.innerBar,
                {
                    height,
                    backgroundColor: innerColorx,
                    width: widthInterpolated,
                },
                ]}
            />
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    outerBar: {
        width: '100%',
        borderRadius: 50,
        overflow: 'hidden',
    },
    innerBar: {
        borderRadius: 50,
    },
});
