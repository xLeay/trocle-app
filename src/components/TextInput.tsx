import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextStyle, View, ViewStyle } from 'react-native';
import { TextVariant } from './Text';

type Props = React.ComponentProps<typeof RNTextInput> & {
    containerStyle?: ViewStyle;
    style?: TextStyle[];
    type?: 'primary' | 'secondary' | 'placeholder' | 'invert' | 'brand';
    variant?: TextVariant;
    placeholderColor?: string;
    caretColor?: string;
}

const ThemedTextInput = forwardRef<RNTextInput, Props>(({
    containerStyle = {},
    style,
    type = 'primary',
    variant = 'body_Large',
    placeholderColor,
    caretColor,
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
                placeholderTextColor={placeholderColor ?? activeTheme.colors.text.placeholder}
                cursorColor={caretColor ?? color}

                {...props}
            />
        </View>
    );
});

export default ThemedTextInput;

