import React, { useMemo } from 'react';
import { Text as RNText, View, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

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

interface Props {
    children: React.ReactNode;
    style?: TextStyle;
    containerStyle?: ViewStyle[];
    type?: 'primary' | 'secondary' | 'placeholder' | 'invert' | 'brand';
    variant?: TextVariant;
    onPress?: () => void;
}

const Text: React.FC<Props> = ({
    children,
    style,
    containerStyle,
    type = 'primary',
    variant = 'body_Large',
    onPress,
}) => {
    const { activeTheme } = useTheme();

    // const typography = activeTheme.typography[variant] || {};
    // const color = activeTheme.colors.text[type];

    // const textStyles: TextStyle[] = [
    //     typography || {},
    //     { color },
    //     ...(style || []),
    // ];

    const combinedStyle = useMemo(() => [
        activeTheme.typography[variant],
        { color: activeTheme.colors.text[type] },
        style,
    ], [activeTheme, type, variant, style]);

    const textElement = (
        <RNText style={combinedStyle} onPress={onPress}>
            {children}
        </RNText>
    );

    if (containerStyle) {
        return <View style={containerStyle}>{textElement}</View>;
    }

    return textElement;
};

export default Text;
