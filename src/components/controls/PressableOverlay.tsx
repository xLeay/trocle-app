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
    overlayScale?: number; // Multiplicateur pour agrandir l'overlay (ex: 1.3 ou 1.5)
    style?: StyleProp<ViewStyle>;
    touchable?: boolean;
    hitSlop?: number | { top: number; bottom: number; left: number; right: number };
} & Omit<PressableProps, 'children' | 'style'>;

export default function PressableOverlay({
    children,
    overlayColor = 'rgba(0, 0, 0, 0.10)',
    borderRadius = 0,
    overlayScale = 1,
    style,
    touchable = true,
    hitSlop = 0,
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
            hitSlop={hitSlop}
            disabled={!touchable}
            {...props}
            style={[style, { borderRadius }]}
            android_ripple={
                android_ripple ?? {
                    color: 'rgba(255, 255, 255, 0.10)',
                    borderless: overlayScale > 1,
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
                        transform: [{ scale: overlayScale }],
                    },
                    overlayStyle,
                ]}
            />
        </Pressable>
    );
}
