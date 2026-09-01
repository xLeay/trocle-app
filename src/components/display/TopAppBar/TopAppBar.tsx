import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Composants
import Flex from '#/Flex';

// Typages
interface TopAppBarProps {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    style?: ViewStyle;
    backgroundTransparent?: boolean;
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    fullWidth?: boolean;
    zIndex?: number;
    hasSafeAreaTop?: boolean;
    onPress?: () => void;
}

// Composant
const TopAppBar = ({
    left,
    center,
    right,
    style,
    backgroundTransparent,
    border = false,
    borderColor = '#000',
    borderWidth = 1,
    fullWidth = false,
    zIndex = 100,
    hasSafeAreaTop = true,
    onPress,
}: TopAppBarProps) => {

    const { activeTheme } = useTheme();
    const insets = useSafeAreaInsets();

    const hasCenter = Boolean(center);

    // Si l'élément existe :
    // - S'il y a un center, les côtés ne prennent que la taille de leur contenu (flex: 0 / shrink: 0)
    // - S'il n'y a pas de center, les côtés peuvent s'étendre (flex: 1)
    const leftStyles = left ? (hasCenter ? styles.sideContent : styles.flexExpand) : styles.isNull;
    const centerStyles = center ? styles.centerExpand : styles.isNull;
    const rightStyles = right ? (hasCenter ? styles.sideContent : styles.flexExpand) : styles.isNull;



    return (
        <Pressable onPress={onPress} style={{ zIndex, ...(border ? { borderColor, borderWidth } : {}) }}>

            {hasSafeAreaTop ? (
                <Flex style={{
                    paddingTop: insets.top,
                    backgroundColor: backgroundTransparent ? 'transparent' : activeTheme.colors.surface.secondary,
                }}
                />
            ) : null}

            <Flex
                direction='row'
                justifyContent="space-between"
                alignItems="center"
                fullWidth={fullWidth}
                style={[
                    styles.container,
                    backgroundTransparent ? {} : { backgroundColor: activeTheme.colors.surface.secondary },
                    style || {}
                ]}
            >
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
    topBar: {
        // flex: 1,
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
    sideContent: {
        flexShrink: 0,
    },
    centerExpand: {
        flex: 1,
        paddingHorizontal: 12,
    },
    flexExpand: {
        flex: 1,
    },
    isNull: {
        flex: 0,
    },
});
