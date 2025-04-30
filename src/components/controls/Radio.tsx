import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';

interface RadioProps {
    checked?: boolean;
    disabled?: boolean;
    onValueChange: () => void;
}

const Radio: React.FC<RadioProps> = ({ checked, disabled = false, onValueChange }) => {

    const { activeTheme } = useTheme();
    const trueBackgroundColor = disabled ?
        [activeTheme.colors.surface.brandLight, activeTheme.colors.surface.secondary] :
        [activeTheme.colors.surface.brand, activeTheme.colors.surface.secondary];

    const trueBorderColor = disabled ? activeTheme.colors.surface.divider : activeTheme.colors.surface.field;

    return (
        <TouchableOpacity
            style={[styles.container]}
            disabled={disabled}
            onPress={onValueChange}
        >
            <View
                style={[
                    styles.circle,
                    {
                        width: 24,
                        height: 24,
                        borderRadius: 24 / 2,
                        backgroundColor: checked ? trueBackgroundColor[0] : trueBackgroundColor[1],
                        borderColor: checked ? 'transparent' : trueBorderColor,
                        borderWidth: checked ? 0 : 1,
                    },
                ]}
            >
                <View
                    style={[
                        styles.innerCircle,
                        {
                            width: 8,
                            height: 8,
                            borderRadius: 8 / 2,
                            backgroundColor: checked ? 'white' : 'transparent',
                        },
                    ]}
                />
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
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    innerCircle: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Radio;
