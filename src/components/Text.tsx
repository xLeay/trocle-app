import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, View, ViewStyle } from 'react-native';

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
    weight?: 'regular' | 'medium' | 'bold';
    variant?: TextVariant;
    textDecorationLine?: 'underline' | 'none' | 'line-through' | 'underline line-through';
    onPress?: () => void;
}

const fontFamilyMap = {
    regular: 'RethinkSans-Regular',
    medium: 'RethinkSans-Medium',
    bold: 'RethinkSans-Bold',
};

const Text: React.FC<Props> = ({
    children,
    style,
    containerStyle,
    type = 'primary',
    weight,
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
            fontFamily: weight ? fontFamilyMap[weight] : undefined,
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
