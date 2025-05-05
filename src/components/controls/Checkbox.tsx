import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

interface CheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    onValueChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, disabled = false, onValueChange }) => {

    const { activeTheme } = useTheme();
    const trueBackgroundColor = disabled ?
        [activeTheme.colors.surface.brandLight, activeTheme.colors.surface.secondary] :
        [activeTheme.colors.surface.brand, activeTheme.colors.surface.secondary];

    const trueBorderColor = disabled ? activeTheme.colors.surface.divider : activeTheme.colors.surface.field;

    return (
        <TouchableOpacity
            style={[styles.container]}
            onPress={onValueChange}
            disabled={disabled}
        >
            <View
                style={[
                    styles.box,
                    {
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        backgroundColor: checked ? trueBackgroundColor[0] : trueBackgroundColor[1],
                        borderColor: checked ? 'transparent' : trueBorderColor,
                        borderWidth: checked ? 0 : 1,
                    },
                ]}
            >
                {checked && (
                    <View style={styles.checkMarkContainer}>
                        <View
                            style={[
                                styles.checkMarkSmall,
                                { backgroundColor: 'white' }
                            ]}
                        />
                        <View
                            style={[
                                styles.checkMarkLarge,
                                { backgroundColor: 'white' }
                            ]}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    checkMarkContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    checkMarkSmall: {
        position: 'absolute',
        width: 2,
        height: 6,
        borderRadius: 1,
        transform: [
            { rotate: '-45deg' },
            { translateX: -3 },
            { translateY: -2 }
        ],
        bottom: 7,
    },
    checkMarkLarge: {
        position: 'absolute',
        width: 2,
        height: 12,
        borderRadius: 1,
        transform: [
            { rotate: '45deg' },
            { translateX: 2 },
            { translateY: 0 }
        ],
        bottom: 7,
    },
});

export default Checkbox;
