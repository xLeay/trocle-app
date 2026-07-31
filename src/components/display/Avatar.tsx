import { useTheme } from '@/src/lib/hooks/useTheme';
import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import defaultImage from '@/assets/avatar.png';

export type AvatarSize = 'enormous' | 'veryLarge' | 'large' | 'medium' | 'small' | 'tiny';

// Taille en pixels pour chaque taille d'avatar
const sizeMapping: Record<AvatarSize, number> = {
    enormous: 128,
    veryLarge: 64,
    large: 56,
    medium: 40,
    small: 32,
    tiny: 24,
};
export interface AvatarProps {
    customImage?: ImageSourcePropType | string; // undefined => image par défaut
    squared?: boolean;
    focused?: boolean;
    size?: AvatarSize;
    onPress?: () => void;
    touchable?: boolean;
    blurred?: number;
}

const Avatar: React.FC<AvatarProps> = ({
    customImage,
    squared = false,
    focused = false,
    size = 'medium',
    onPress,
    touchable = true,
    blurred = 0,
}) => {

    const { activeTheme } = useTheme();

    const pressedValue = useSharedValue(0);
    const handlePressIn = () => { pressedValue.value = withTiming(1, { duration: 100 }) };
    const handlePressOut = () => { pressedValue.value = withTiming(0, { duration: 100 }) };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressedValue.value,
                [0, 1],
                [
                    'transparent',
                    activeTheme.colors.surface.transparent
                ]
            ),
        };
    });

    const dimension = sizeMapping[size];

    const containerStyle: ViewStyle = {
        width: dimension,
        height: dimension,
        borderRadius: squared ? activeTheme.radius.default : dimension / 2,
        overflow: 'hidden',
        borderWidth: focused ? 2 : 0,
        borderColor: focused ? activeTheme.colors.surface.contrast : 'transparent',

    };

    const getViewImageComponents = (animatedView: boolean = false) => {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    style={styles.image}
                    source={customImage || defaultImage}
                    contentFit="cover"
                    transition={500}
                    blurRadius={blurred}
                />
                {animatedView && (
                    <Animated.View
                        pointerEvents="none"
                        style={[StyleSheet.absoluteFillObject, animatedStyle]}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={containerStyle}>
            {touchable ? (
                <Pressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={{ flex: 1 }}
                >
                    {getViewImageComponents(true)}
                </Pressable>
            ) : (
                getViewImageComponents()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
});

export default Avatar;
