import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';
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
                    header: () =>
                        <Flex gap={activeTheme.spacing._100} direction="row" style={{
                            backgroundColor: activeTheme.colors.surface.secondary,
                            width: '100%',
                            paddingLeft: activeTheme.spacing._200,
                            paddingRight: activeTheme.spacing._100
                        }}>
                            <Flex direction='row' justifyContent='flex-start' style={{ flex: 1 }}>
                                <TopAppBar
                                    left={left}
                                    center={center}
                                    right={right}
                                    style={{
                                        paddingHorizontal: 0,
                                    }}
                                />
                            </Flex>
                            <Flex direction='row' style={{
                                height: 60,
                            }}>
                                <Button icon={<Notification />} variant="ghost" size="large" onPress={() => console.log('Notifications')} />
                            </Flex>
                        </Flex>,
                }}
            />
            <Text>Tab Messages</Text>
            <Text>{search || 'No search'}</Text>
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
