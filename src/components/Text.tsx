import React, { useMemo } from 'react';
import { Text as RNText, View, TextStyle, ViewStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';

export type TextVariant =
    | 'display_Large'
    | 'display_Medium'
    | 'display_Small'
    | 'title_Large'
    | 'title_Medium'
    | 'title_Small'
    | 'body_Large'
    | 'body_Medium'
    | 'body_Small'
    | 'label_Large'
    | 'label_Medium'
    | 'label_Small'
    | 'button_Large';

interface Props extends RNTextProps {
    children: React.ReactNode;
    style?: TextStyle;
    containerStyle?: ViewStyle;
    type?: 'primary' | 'secondary' | 'placeholder' | 'invert' | 'brand';
    variant?: TextVariant;
    textDecorationLine?: 'underline' | 'none' | 'line-through' | 'underline line-through';
    onPress?: () => void;
}

const Text: React.FC<Props> = ({
    children,
    style,
    containerStyle,
    type = 'primary',
    variant = 'body_Large',
    textDecorationLine = 'none',
    onPress,
    ...rest
}) => {
    const { activeTheme } = useTheme();

    const combinedStyle = useMemo(() => [
        activeTheme.typography[variant],
        {
            color: activeTheme.colors.text[type],
            textDecorationLine: textDecorationLine,
        },
        style,
    ], [activeTheme, type, variant, style]);

    const textElement = (
        <RNText style={combinedStyle} onPress={onPress} {...rest}>
            {children}
        </RNText>
    );

    if (containerStyle) {
        return <View style={containerStyle}>{textElement}</View>;
    }

    return textElement;
};

export default Text;
