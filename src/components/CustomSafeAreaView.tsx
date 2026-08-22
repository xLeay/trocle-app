import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomSafeAreaViewProps = {
    children: React.ReactNode;
    edges?: Edge[];
    style?: StyleProp<ViewStyle>;
};

const CustomSafeAreaView = ({
    children,
    edges = ['left', 'right', 'bottom'],
    style,
}: CustomSafeAreaViewProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                {
                    flex: 1,
                    paddingTop: edges.includes('top') ? insets.top : 0,
                    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
                    paddingLeft: edges.includes('left') ? insets.left : 0,
                    paddingRight: edges.includes('right') ? insets.right : 0,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

export default CustomSafeAreaView;
