import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';

// Composants
import Flex from '#/Flex';

// Typages
interface TopAppBarProps {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    style?: ViewStyle;
    backgroundTransparent?: boolean;
    invertedStyle?: boolean;
    onPress?: () => void;
}

// Composant
const TopAppBar = ({
    left,
    center,
    right,
    style,
    backgroundTransparent,
    onPress,
}: TopAppBarProps) => {

    const { activeTheme } = useTheme();

    const getNotNullStyles = (element: React.ReactNode = null) => {
        return element ? styles.isNotNull : styles.isNull;
    };

    const leftStyles = getNotNullStyles(left);
    const centerStyles = getNotNullStyles(center);
    const rightStyles = getNotNullStyles(right);

    return (
        <Pressable onPress={onPress}>
            <Flex
                direction='row'
                justifyContent="space-between"
                alignItems="center"
                style={[styles.container, backgroundTransparent ?
                    {} : { backgroundColor: activeTheme.colors.surface.secondary }, style || {}]}
            >
                {/* <View style={[styles.topBar, styles.topBarLeft, { flex: left ? 1 : 0 }]}> */}
                <Flex style={[styles.topBar, styles.topBarLeft, leftStyles]}>
                    {left}
                </Flex>
                <Flex style={[styles.topBar, styles.topBarCenter, centerStyles]}>
                    {center}
                </Flex>
                <Flex style={[styles.topBar, styles.topBarRight, rightStyles]}>
                    {right}
                </Flex>
            </Flex>
        </Pressable>
    );
};

export default TopAppBar;

// Styles
const styles = StyleSheet.create({
    container: {
        minHeight: 60,
        paddingHorizontal: 16,

        // borderColor: 'red',
        // borderWidth: 1,
    },
    placeholder: {
        width: 1,
        height: 1,
    },
    isNotNull: {
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
