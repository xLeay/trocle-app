import { forwardRef } from 'react';
import { ScrollView, ScrollViewProps, View, ViewProps, ViewStyle } from 'react-native';

interface Props extends ViewProps {
    style?: ViewStyle | ViewStyle[];
    gap?: number;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    scroll?: boolean;
    scrollProps?: ScrollViewProps;
    overflow?: 'visible' | 'hidden';
    zIndex?: number;
    fullWidth?: boolean;
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
    zIndex,
    fullWidth = false,
    children,
    ...props
}, ref) => {

    const baseContentStyle: ViewStyle = {
        flexDirection: direction,
        justifyContent,
        alignItems,
        gap,
    };

    const viewStyle: ViewStyle = {
        overflow,
        borderColor: border ? borderColor : 'transparent',
        borderWidth: border ? borderWidth : 0,
        zIndex,
        ...(fullWidth && { width: '100%' }),
    };


    if (scroll) {

        return (
            <ScrollView
                ref={ref}
                horizontal={direction === 'row'}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                style={[viewStyle, style]}
                contentContainerStyle={baseContentStyle}
                overScrollMode='never'
                bounces={true}
                {...scrollProps}
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View ref={ref} style={[viewStyle, baseContentStyle, style]} {...props}>{children}</View>
    );
});

export default Flex;