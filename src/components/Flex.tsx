import React, { forwardRef } from 'react';
import { View, ScrollView, ViewProps, ScrollViewProps, ViewStyle } from 'react-native';

interface Props extends ViewProps {
    style?: ViewStyle | ViewStyle[];
    gap?: number;
    direction?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    scroll?: boolean;
    scrollProps?: ScrollViewProps;
    overflow?: 'visible' | 'hidden';
}

// Utilisation de React.ForwardRefRenderFunction pour une meilleure inférence de type
const Flex = forwardRef<any, Props>(({
    style,
    gap = 0,
    direction = 'column',
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
    border = false,
    borderColor = '#000',
    borderWidth = 1,
    scroll = false,
    scrollProps = {},
    overflow = 'visible',
    children,
    ...props
}, ref) => {

    const baseContentStyle = {
        flexDirection: direction,
        justifyContent: justifyContent,
        alignItems: alignItems,
        gap: gap,
    };

    const viewStyle = {
        overflow: overflow,
        borderColor: border ? borderColor : 'transparent',
        borderWidth: border ? borderWidth : 0,
    };

    if (scroll) {
        const isHorizontal = direction === 'row';

        return (
            <ScrollView
                ref={ref}
                horizontal={isHorizontal}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                style={[viewStyle, style]}
                contentContainerStyle={baseContentStyle}
                {...scrollProps}
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View ref={ref} style={[viewStyle, baseContentStyle, style]} {...props}>
            {children}
        </View>
    );
});

export default Flex;