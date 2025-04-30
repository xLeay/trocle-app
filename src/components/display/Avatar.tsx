import React from 'react';
import { View, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/src/hooks/useTheme';

type AvatarSize = 'enormous' | 'veryLarge' | 'large' | 'medium' | 'small' | 'tiny';

export interface AvatarProps {
    customImage?: ImageSourcePropType; // undefined => image par défaut
    squared?: boolean;
    focused?: boolean;
    size?: AvatarSize;
}

// Taille en pixels pour chaque taille d'avatar
const sizeMapping: Record<AvatarSize, number> = {
    enormous: 128,
    veryLarge: 64,
    large: 56,
    medium: 40,
    small: 32,
    tiny: 24,
};

import defaultImage from '@/assets/avatar.png';

const Avatar: React.FC<AvatarProps> = ({
    customImage,
    squared = false,
    focused = false,
    size = 'medium',
}) => {

    const { activeTheme } = useTheme();
    const dimension = sizeMapping[size];

    const containerStyle: ViewStyle = {
        width: dimension,
        height: dimension,
        borderRadius: squared ? activeTheme.radius.default : dimension / 2,
        overflow: 'hidden',
        borderWidth: focused ? 2 : 0,
        borderColor: focused ? activeTheme.colors.surface.contrast : 'transparent',
    };

    return (
        <View style={containerStyle}>
            <Image
                style={styles.image}
                source={customImage || defaultImage}
                contentFit="cover"
                transition={500}
            />
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
