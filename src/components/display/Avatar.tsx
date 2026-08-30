import { Image, ImageSource } from 'expo-image';
import React, { memo } from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

import defaultImage from '@/assets/avatar.png';


export type AvatarSize = 'enormous' | 'veryLarge' | 'large' | 'medium' | 'small' | 'tiny';

const sizeMapping: Record<AvatarSize, number> = {
    enormous: 128,
    veryLarge: 64,
    large: 56,
    medium: 40,
    small: 32,
    tiny: 24,
};

export interface AvatarProps {
    customImage?: ImageSourcePropType | string;
    squared?: boolean;
    focused?: boolean;
    size?: AvatarSize;
    onPress?: () => void;
    touchable?: boolean;
    blurred?: number;
    transition?: number;
    recyclingKey?: string;
    grayScale?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
    customImage,
    squared = false,
    focused = false,
    size = 'medium',
    onPress,
    touchable = true,
    blurred = 0,
    transition = 250,
    recyclingKey,
    grayScale = false
}) => {
    const { activeTheme } = useTheme();

    const DURATION = 100;
    const pressedValue = useSharedValue(0);

    const handlePressIn = () => {
        if (touchable) pressedValue.value = withTiming(1, { duration: DURATION });
    };
    const handlePressOut = () => {
        if (touchable) pressedValue.value = withTiming(0, { duration: DURATION });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            pressedValue.value,
            [0, 1],
            ['transparent', activeTheme.colors.surface.transparent]
        ),
    }));

    const dimension = sizeMapping[size];
    const borderRadius = squared ? activeTheme.radius.default : dimension / 2;

    const imageSource = (customImage || defaultImage) as ImageSource;

    return (
        <View
            style={[
                styles.container,
                {
                    width: dimension,
                    height: dimension,
                    borderRadius,
                    // Applique la bordure de focus SANS impacter l'image interne
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? activeTheme.colors.surface.contrast : 'transparent',
                },
            ]}
        >
            {touchable ? (
                <Pressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.fullSize}
                >
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            ...(grayScale && { filter: [{ grayscale: 1 }] })
                        }}
                        source={imageSource}
                        contentFit="cover"
                        transition={transition}
                        blurRadius={blurred}
                        cachePolicy="memory"
                        recyclingKey={recyclingKey}
                    />
                    <Animated.View
                        pointerEvents="none"
                        style={[StyleSheet.absoluteFill, animatedStyle]}
                    />
                </Pressable>
            ) : (
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        ...(grayScale && { filter: [{ grayscale: 1 }] })
                    }}
                    source={imageSource}
                    contentFit="cover"
                    transition={transition}
                    blurRadius={blurred}
                    cachePolicy="memory"
                    recyclingKey={recyclingKey}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    fullSize: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default memo(Avatar);