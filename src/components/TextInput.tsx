import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps, TextStyle, View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { TextVariant } from './Text';

type Props = React.ComponentProps<typeof RNTextInput> & {
    containerStyle?: ViewStyle;
    style?: TextStyle[];
    type?: 'primary' | 'secondary' | 'placeholder' | 'invert' | 'brand';
    variant?: TextVariant;
}

const ThemedTextInput = forwardRef<RNTextInput, Props>(({
    containerStyle = {},
    style,
    type = 'primary',
    variant = 'body_Large',
    ...props
}, ref) => {

    const { activeTheme } = useTheme();

    const typography = activeTheme.typography[variant] || {};
    const color = activeTheme.colors.text[type];

    const inputStyles: TextStyle[] = [
        typography,
        { color },
        ...(style || []),
    ];

    return (
        <View style={[containerStyle]}>
            <RNTextInput
                ref={ref}
                style={[inputStyles]}
                placeholderTextColor={activeTheme.colors.text.placeholder}
                cursorColor={color}
                {...props}
            />
        </View>
    );
});

export default ThemedTextInput;

