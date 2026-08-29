// import { forwardRef } from 'react';
// import { ScrollView, ScrollViewProps, View, ViewProps, ViewStyle } from 'react-native';

// interface Props extends ViewProps {
//     style?: ViewStyle | ViewStyle[];
//     gap?: number;
//     direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
//     justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
//     alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
//     border?: boolean;
//     borderColor?: string;
//     borderWidth?: number;
//     scroll?: boolean;
//     scrollProps?: ScrollViewProps;
//     overflow?: 'visible' | 'hidden';
//     zIndex?: number;
//     fullWidth?: boolean;
// }

// // Utilisation de React.ForwardRefRenderFunction pour une meilleure inférence de type
// const Flex = forwardRef<any, Props>(({
//     style,
//     gap = 0,
//     direction = 'column',
//     justifyContent = 'flex-start',
//     alignItems = "flex-start",
//     border = false,
//     borderColor = '#000',
//     borderWidth = 1,
//     scroll = false,
//     scrollProps = {},
//     overflow = 'visible',
//     zIndex,
//     fullWidth = false,
//     children,
//     ...props
// }, ref) => {

//     const baseContentStyle: ViewStyle = {
//         flexDirection: direction,
//         justifyContent,
//         alignItems,
//         gap,
//     };

//     const viewStyle: ViewStyle = {
//         overflow,
//         borderColor: border ? borderColor : 'transparent',
//         borderWidth: border ? borderWidth : 0,
//         zIndex,
//         ...(fullWidth && { width: '100%' }),
//     };

//     if (scroll) {
//         return (
//             <ScrollView
//                 ref={ref}
//                 horizontal={direction === 'row'}
//                 showsHorizontalScrollIndicator={false}
//                 showsVerticalScrollIndicator={true}
//                 style={[
//                     viewStyle,
//                     direction === 'row' && {
//                         flexGrow: 0,
//                         flexShrink: 0,
//                     },
//                     style,
//                 ]}
//                 contentContainerStyle={[
//                     baseContentStyle,
//                     scrollProps.contentContainerStyle,
//                 ]}
//                 overScrollMode='never'
//                 bounces={true}
//                 {...scrollProps}
//             >
//                 {children}
//             </ScrollView>
//         );
//     }

//     return (
//         <View ref={ref} style={[viewStyle, baseContentStyle, style]} {...props}>
//             {children}
//         </View>
//     );
// });

// export default Flex;


import { forwardRef, memo } from 'react';
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

const FlexComponent = forwardRef<any, Props>(({
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

    // Styles appliqués uniquement au conteneur / ScrollView extérieure
    const outerStyle: ViewStyle = {
        overflow,
        zIndex,
        ...(fullWidth && { width: '100%' }),
        ...(border && { borderColor, borderWidth }),
    };

    // Styles appliqués au contenu flex / contentContainerStyle
    const innerStyle: ViewStyle = {
        flexDirection: direction,
        justifyContent,
        alignItems,
        gap,
    };

    if (scroll) {
        return (
            <ScrollView
                ref={ref}
                horizontal={direction === 'row'}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                style={[
                    outerStyle,
                    direction === 'row' && styles.rowScroll,
                    style,
                ]}
                contentContainerStyle={[
                    innerStyle,
                    scrollProps.contentContainerStyle,
                ]}
                overScrollMode="never"
                bounces={true}
                {...scrollProps}
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View ref={ref} style={[outerStyle, innerStyle, style]} {...props}>
            {children}
        </View>
    );
});

const styles = {
    rowScroll: {
        flexGrow: 0,
        flexShrink: 0,
    } as ViewStyle,
};

const Flex = memo(FlexComponent);

export default Flex;