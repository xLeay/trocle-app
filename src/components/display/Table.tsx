import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

// Composants
import Flex from '#/Flex';
import TableLeft from '#/_partial/TableLeft';
import TableRight from '#/_partial/TableRight';

interface TableProps {
    leftProps?: React.ComponentProps<typeof TableLeft>;
    rightProps?: React.ComponentProps<typeof TableRight>;
    style?: ViewStyle;
}

const Table: React.FC<TableProps> = ({
    leftProps,
    rightProps,
    style = {},
}) => {

    return (
        <Flex direction='row' justifyContent='space-between' style={[styles.container, style]}>
            <TableLeft {...leftProps} />
            <TableRight {...rightProps} />
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        width: '100%',
        // flex: 1,
        paddingHorizontal: 16,

        // borderWidth: 1,
        // borderColor: 'black',
    },
});

export default Table;

// Pour utiliser une Table dans un header
// const tableLeft = {
//     variant: 'icon',
//     leftText: 'Profil',
//     legendText: 'Admin',
//     icon: <Home />,
// } as const;

// const tableRight = {
//     variant: 'text',
//     rightText: 'Voir plus',
//     chevron: true,
//     active: true
// } as const;