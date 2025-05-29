import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Test from '#/feed/Test';

export default function Tab() {
    const { activeTheme } = useTheme();
    const [search, setSearch] = useState('');
    const { left, center, right } = useTopAppBar("_search", {
        search,
        setSearch,
        placeHolder: "Recherchez sur Trocle",
    });

    return (
        <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}>
            <Stack.Screen
                options={{
                    title: 'Discover',
                    header: () => <TopAppBar left={left} center={center} right={right} />,
                }}
            />
            {/* <Feed /> */}
            <Test />
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
