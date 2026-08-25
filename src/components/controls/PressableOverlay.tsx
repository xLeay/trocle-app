import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type PressableOverlayProps = {
    children: React.ReactNode;
    overlayColor?: string;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'children' | 'style'>;

export default function PressableOverlay({
    children,
    overlayColor = 'rgba(0, 0, 0, 0.10)',
    borderRadius = 0,
    style,
    onPressIn,
    onPressOut,
    android_ripple,
    ...props
}: PressableOverlayProps) {
    const progress = useSharedValue(0);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <Pressable
            {...props}
            style={[style, { borderRadius }]}
            android_ripple={
                android_ripple ?? {
                    color: 'rgba(255, 255, 255, 0.10)',
                    borderless: false,
                    radius: 180
                }
            }
            onPressIn={(event) => {
                progress.value = withTiming(1, { duration: 180 });
                onPressIn?.(event);
            }}
            onPressOut={(event) => {
                progress.value = withTiming(0, { duration: 180 });
                onPressOut?.(event);
            }}
        >
            {children}

            <Animated.View
                pointerEvents="none"
                style={[
                    {
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: overlayColor,
                        borderRadius,
                    },
                    overlayStyle,
                ]}
            />
        </Pressable>
    );
}
