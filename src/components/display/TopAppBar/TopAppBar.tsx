import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';

// Composants
import Flex from '#/Flex';

// Typages
interface TopAppBarProps {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    style?: ViewStyle;
}

// Composant
const TopAppBar = ({
    left,
    center,
    right,
    style,
}: TopAppBarProps) => {

    const { activeTheme } = useTheme();

    const getNotNullStyles = (element: React.ReactNode = null) => {
        return element ? styles.isNotNull : styles.isNull;
    };

    const leftStyles = getNotNullStyles(left);
    const centerStyles = getNotNullStyles(center);
    const rightStyles = getNotNullStyles(right);

    return (
        <Flex
            direction='row'
            justifyContent="space-between"
            alignItems="center"
            style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }, style || {}]}
        >
            {/* <View style={[styles.topBar, styles.topBarLeft, { flex: left ? 1 : 0 }]}> */}
            <View style={[styles.topBar, styles.topBarLeft, leftStyles]}>
                {left}
            </View>
            <View style={[styles.topBar, styles.topBarCenter, centerStyles]}>
                {center}
            </View>
            <View style={[styles.topBar, styles.topBarRight, rightStyles]}>
                {right}
            </View>
        </Flex>
    );
};

export default TopAppBar;

// Styles
const styles = StyleSheet.create({
    container: {
        minHeight: 60,

        // borderColor: '#000',
        // borderWidth: 1,
    },
    placeholder: {
        width: 1,
        height: 1,
    },
    isNotNull: {
        paddingHorizontal: 16,
        flex: 1,
    },
    isNull: {
        flex: 0,
    },
    topBar: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',

        // backgroundColor: '#FF000025',
    },
    topBarLeft: {
        justifyContent: 'flex-start',

        // backgroundColor: '#FFFF0025',
    },
    topBarCenter: {
        justifyContent: 'center',

        // backgroundColor: '#FF00FF25',
    },
    topBarRight: {
        justifyContent: 'flex-end',

        // backgroundColor: '#FF000025',
    },
});
