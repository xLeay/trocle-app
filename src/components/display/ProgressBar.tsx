import { useTheme } from '@/src/lib/hooks/useTheme';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

interface ProgressBarProps {
    progress?: number;
    animatedProgress?: SharedValue<number>;
    type?: 'primary' | 'mono';
    height?: number;
    innerColor?: string;
    outerColor?: string;
    style?: ViewStyle;
}

const ProgressBar = ({
    progress = 0,
    animatedProgress,
    type = 'primary',
    height = 4,
    innerColor,
    outerColor,
    style,
}: ProgressBarProps) => {
    const { activeTheme } = useTheme();

    const animatedStyle = useAnimatedStyle(() => {
        const value = animatedProgress?.value ?? progress;
        const clampedValue = Math.min(Math.max(value, 0), 1);

        return {
            width: `${clampedValue * 100}%`,
        };
    }, [progress, animatedProgress]);

    const resolvedOuterColor =
        outerColor ??
        (type === 'mono'
            ? activeTheme.colors.border.primary35
            : activeTheme.colors.surface.divider);

    const resolvedInnerColor =
        innerColor ??
        (type === 'mono'
            ? activeTheme.colors.surface.primary
            : activeTheme.colors.surface.brand);

    return (
        <View
            style={[
                styles.outerBar,
                {
                    height,
                    borderRadius: height / 2,
                    backgroundColor: resolvedOuterColor,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.innerBar,
                    {
                        height,
                        borderRadius: height / 2,
                        backgroundColor: resolvedInnerColor,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    outerBar: {
        width: '100%',
        overflow: 'hidden',
    },
    innerBar: {
        width: 0,
    },
});