import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface DividerProps {
    type?: 'thin' | 'thick';
    padding?: boolean;
    style?: ViewStyle;
}

const Divider = ({
    type = 'thin',
    padding = false,
    style,

}: DividerProps) => {
    const { activeTheme } = useTheme();

    const dividerHeight = type === 'thin' ? 1 : 8;
    const dividerPadding = padding ? 16 : 0;
    return (
        <View style={[styles.dividerContainer, { height: dividerHeight, paddingHorizontal: dividerPadding }, style]}>
            <View style={[styles.divider, { backgroundColor: activeTheme.colors.surface.divider }]} />
        </View>
    );
};

export default Divider;

const styles = StyleSheet.create({
    dividerContainer: {
        width: '100%',
    },
    divider: {
        width: '100%',
        height: '100%',
    },
});
