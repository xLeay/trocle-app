import React, { forwardRef } from 'react';
import { View, ViewProps, ViewStyle, ScrollView, ScrollViewProps } from 'react-native';

interface GridProps extends ViewProps {
    style?: ViewStyle | ViewStyle[];
    columns?: number;
    rows?: number;
    columnGap?: number;
    rowGap?: number;
    gap?: number;
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    scroll?: boolean;
    scrollProps?: ScrollViewProps;
    overflow?: 'visible' | 'hidden';
}

const Grid = forwardRef<any, GridProps>(({
    style,
    columns = 2,
    rows,
    columnGap = 0,
    rowGap = 0,
    gap = 0,
    justifyContent = 'flex-start',
    alignItems = 'stretch',
    border = false,
    borderColor = '#000',
    borderWidth = 1,
    scroll = false,
    scrollProps = {},
    overflow = 'visible',
    children,
    ...props
}, ref) => {
    // Utiliser gap comme valeur par défaut si columnGap ou rowGap ne sont pas spécifiés
    const finalColumnGap = columnGap || gap;
    const finalRowGap = rowGap || gap;

    const itemsArray = React.Children.toArray(children);
    const rows_count = rows || Math.ceil(itemsArray.length / columns);

    // Organisation des éléments en grille
    const gridContainerStyle: ViewStyle = {
        overflow: overflow,
        borderColor: border ? borderColor : 'transparent',
        borderWidth: border ? borderWidth : 0,
    };

    // Style pour le contenu de la grille
    const gridContentStyle: ViewStyle = {
        flexDirection: 'column',
        justifyContent: justifyContent,
        alignItems: alignItems,
    };

    // Créer les rangées de la grille
    const createGridRows = () => {
        const gridRows = [];

        for (let i = 0; i < rows_count; i++) {
            const rowItems = itemsArray.slice(i * columns, (i + 1) * columns);

            // Si la dernière rangée n'est pas complète, ajouter des espaces vides
            while (rowItems.length < columns) {
                rowItems.push(null);
            }

            gridRows.push(
                <View
                    key={`row-${i}`}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginBottom: i < rows_count - 1 ? finalRowGap : 0,
                        width: '100%',
                    }}
                >
                    {rowItems.map((item, index) => (
                        <View
                            key={`item-${i}-${index}`}
                            style={{
                                flex: 1,
                                marginRight: index < columns - 1 ? finalColumnGap : 0,
                            }}
                        >
                            {item}
                        </View>
                    ))}
                </View>
            );
        }

        return gridRows;
    };

    // Rendu avec ou sans scroll
    if (scroll) {
        return (
            <ScrollView
                ref={ref}
                style={[gridContainerStyle, style]}
                contentContainerStyle={gridContentStyle}
                showsVerticalScrollIndicator={true}
                {...scrollProps}
            >
                {createGridRows()}
            </ScrollView>
        );
    }

    return (
        <View
            ref={ref}
            style={[gridContainerStyle, gridContentStyle, style]}
            {...props}
        >
            {createGridRows()}
        </View>
    );
});

export default Grid;