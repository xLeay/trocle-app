import React, { act } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Text from '#/Text';

interface ImagePaginationProps {
    total: number;
    currentIndex: number;
    type?: 'dot' | 'text';
    dotSize?: number;
    activeColor?: string;
    inactiveColor?: string;
    containerStyle?: ViewStyle;
    textBoxStyle?: ViewStyle;
}

const ImagePagination: React.FC<ImagePaginationProps> = ({
    total,
    currentIndex,
    type = 'dot',
    dotSize = 8,
    activeColor,
    inactiveColor,
    containerStyle,
    textBoxStyle,
}) => {
    const { activeTheme } = useTheme();

    activeColor = activeColor || activeTheme.colors.surface.primary;
    inactiveColor = inactiveColor || activeTheme.colors.surface.field;
    
    if (total <= 1) return null;

    if (type === 'text') {
        return (
            <View style={[styles.textBox, { 
                backgroundColor: activeTheme.colors.surface.transparent, 
                paddingHorizontal: activeTheme.spacing._100, 
                paddingVertical: activeTheme.spacing._50,
                borderRadius: activeTheme.radius.default,
            }, textBoxStyle]}>
                <Text variant='body_Medium' type='invert'>{currentIndex + 1} / {total}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.dotContainer, containerStyle]}>
            {Array.from({ length: total }).map((_, index) => (
                <View
                    key={index}
                    style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: currentIndex === index ? activeColor : inactiveColor,
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)',
                    }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    dotContainer: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBox: {
        alignSelf: 'center',
    },
});

export default ImagePagination;
