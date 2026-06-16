import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Tooltip from '#/display/Tooltip';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Notification, Plus } from '#/icons';


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
            <Text>Tab Messages</Text>
            <Text>{search || 'No search'}</Text>

            <Flex style={{ height: 60 }} />

            <Flex border gap={32} alignItems='center'>
                <Tooltip
                    content="Les infobulles riches attirent l'attention sur un élément particulier de la fonctionnalité qui mérite l'attention de l'utilisateur."
                    type='rich'
                    title='Titre'
                    actions={[
                        <Button
                            key='action_1'
                            variant='ghost'
                            label='Annuler'
                            onPress={() => console.log('Annuler')}
                        />
                        ,
                        <Button
                            key='action_2'
                            variant='ghost'
                            label='Valider'
                            onPress={() => console.log('Valider')}
                        />
                    ]}
                >
                    <Flex border style={{ padding: activeTheme.spacing._200 }}>
                        <Text variant='body_Small'>Tooltip Rich</Text>
                    </Flex>
                </Tooltip>

                <Tooltip
                    content='Ajouter aux favoris'
                >
                    <Flex border style={{ padding: activeTheme.spacing._200 }}>
                        <Text variant='body_Small'>Tooltip Simple (une ligne)</Text>
                    </Flex>
                </Tooltip>

                <Tooltip
                    content='Cliquez ici pour ajouter cet article à vos favoris. Cela vous permet de le retrouver facilement plus tard dans votre liste personnalisée'
                >
                    <Flex border style={{ padding: activeTheme.spacing._200 }}>
                        <Text variant='body_Small'>Tooltip Simple (plusieurs lignes)</Text>
                    </Flex>
                </Tooltip>

                <Tooltip
                    content='Button'
                >
                    <Button
                        variant='outlined'
                        size='large'
                        icon={<Plus />}
                        onPress={() => {
                            console.log(`cliqué: ${count++}`);
                        }}
                    />
                </Tooltip>
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
