import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import useTopAppBar from '@/src/hooks/useTopAppBar';
import { useTheme } from '@/src/hooks/useTheme';

import Button from '#/controls/Button';
import Flex from '#/Flex';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Notification } from '#/icons';



export default function Tab() {
    const { activeTheme } = useTheme();

    const [search, setSearch] = useState('');
    const { left, center, right } = useTopAppBar("_search", {
        search: search,
        setSearch: setSearch,
        placeHolder: "Recherche",
    });

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Messages',
                    header: () => <Flex direction="row" style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                        <Button icon={<Notification />} variant="ghost" size="small" onPress={() => console.log('Notifications')} />
                    </Flex>,
                }}
            />
            <Text>Tab Messages</Text>
            <Text>{search}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
