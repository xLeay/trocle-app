import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Notification } from '#/icons';
import Table from '@/src/components/display/Table';


export default function Tab() {
    const { activeTheme } = useTheme();

    const [search, setSearch] = useState('');
    const { left, center, right } = useTopAppBar("_search", {
        search: search,
        setSearch: setSearch,
        placeHolder: "Recherche",
    });

    let count = 1;

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

            {/* <Text>Tab Messages</Text>
            <Text>{search || 'No search'}</Text> */}


            <Flex border style={{ flex: 1, width: '100%', paddingVertical: activeTheme.spacing._100 }}>
                <Flex border gap={activeTheme.spacing._200}
                    style={{ width: '100%' }}
                >
                    <Table
                        leftProps={{
                            variant: 'avatar',
                            leftText: 'Shuri',
                            legendText: 'Ça me va, on fait comme ça !',
                            src: 'https://api.dicebear.com/10.x/dylan/svg?seed=' + Math.random(),
                        }}
                        rightProps={{
                            variant: 'timestamp',
                            timestampText: '1 h',
                        }}
                    />
                    <Table
                        leftProps={{
                            variant: 'avatar',
                            leftText: 'Mon profil',
                            // src: require('@/assets/icon.png'),
                            src: 'https://api.dicebear.com/10.x/dylan/svg?seed=' + Math.random(),
                        }}
                        rightProps={{
                            variant: 'empty',
                        }}
                    />

                </Flex>
            </Flex>
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
