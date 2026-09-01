import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomSafeAreaViewProps = {
    children: React.ReactNode;
    edges?: Edge[];
    style?: StyleProp<ViewStyle>;
};

/**
 * Conteneur Safe Area personnalisé.
 * 
 * `edges` définit les côtés où l'on APPLIQUE le padding :
 * - Par défaut : `['left', 'right', 'bottom']` (le haut est ignoré car souvent géré par la TopAppBar).
 * - `edges={['top']}` : protège UNIQUEMENT le haut.
 * - `edges={[]}` : désactive complètement les paddings de sécurité.
 */
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
