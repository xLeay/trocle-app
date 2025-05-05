import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Button from '#/controls/Button';
import Feed from '#/feed/Feed';

export default function Tab() {
    const { activeTheme } = useTheme();
    const [search, setSearch] = useState('');
    const { left, center, right } = useTopAppBar("_search", {
        search,
        setSearch,
        placeHolder: "Recherchez sur Trocle",
    });

    return (
        <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.primary }]}>
            <Stack.Screen
                options={{
                    title: 'Discover',
                    header: () => <TopAppBar left={left} center={center} right={right} />,
                }}
            />
            <Feed />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 16,
    },
    item: {
        width: 343,
        height: 324,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
