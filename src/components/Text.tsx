import React from 'react';
import { Text, View, TextStyle, ViewStyle } from 'react-native';
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
    style?: TextStyle[]; // Style supplémentaire pour le texte
    containerStyle?: ViewStyle; // Style supplémentaire pour le conteneur
    type?: 'primary' | 'secondary' | 'placeholder' | 'invert' | 'brand'; // Type de texte pour appliquer des couleurs
    variant?: TextVariant; // Variante de typographie (ex. "Display Large")
    onPress?: () => void; // Fonction à appeler lorsqu'on clique sur le texte
}


const TextComponent: React.FC<Props> = ({
    children,
    style,
    containerStyle,
    type = 'primary',
    variant = 'body_Large',
    onPress,
}) => {
    const { theme, activeTheme, toggleTheme } = useTheme();
    

    // Styles spécifiques à la typographie (variant)
    const typography = activeTheme.typography[variant] || {};

    // Gestion des couleurs selon le type
    const color = activeTheme.colors.text[type];

    // Styles pour le conteneur
    const textStyles: TextStyle[] = [
        typography || {},
        { color },
        ...(style || []),
    ];

    return (
        <View style={containerStyle}>
            <Text style={textStyles} onPress={onPress}>
                {children}
            </Text>
        </View>
    );
};

export default TextComponent;
