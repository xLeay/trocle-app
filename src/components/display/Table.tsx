import React, { useState } from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

// Composants
import Flex from '#/Flex';
import TableLeft from '#/_partial/TableLeft';
import TableRight from '#/_partial/TableRight';

interface TableProps {
    leftProps?: React.ComponentProps<typeof TableLeft>;
    rightProps?: React.ComponentProps<typeof TableRight>;
    style?: ViewStyle;
    onPress?: () => void;
}

const Table: React.FC<TableProps> = ({
    leftProps,
    rightProps,
    style = {},
    onPress,
}) => {
    const { activeTheme } = useTheme();

    const pressedValue = useSharedValue(0);

    const handlePressIn = () => { pressedValue.value = withTiming(1, { duration: 150 }) };
    const handlePressOut = () => { pressedValue.value = withTiming(0, { duration: 150 }) };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressedValue.value,
                [0, 1],
                [
                    activeTheme.colors.surface.secondary,
                    activeTheme.colors.surface.neutralLight
                ]
            ),
        };
    });

    return (
        <Animated.View style={[styles.container, style, animatedStyle, { borderRadius: activeTheme.radius.card, paddingHorizontal: activeTheme.spacing._200 }]}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Flex direction='row' justifyContent='space-between'>
                    <TableLeft {...leftProps} />
                    <TableRight {...rightProps} />
                </Flex>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        width: '100%',
        // flex: 1,

        // borderWidth: 1,
        // borderColor: 'red',
    },
});

export default Table;

// Pour utiliser une Table dans un header
// const tableLeft = {
//     variant: 'icon',
//     leftText: 'Profil',
//     legendText: 'Admin',
//     icon: <Home />,
// } as const;

// const tableRight = {
//     variant: 'text',
//     rightText: 'Voir plus',
//     chevron: true,
//     active: true
// } as const;