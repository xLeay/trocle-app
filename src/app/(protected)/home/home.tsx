import { useTheme } from '@/src/lib/hooks/useTheme';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Image } from 'expo-image';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

// Composants
import Button from '#/controls/Button';
import Switch from '#/controls/Switch';
import Radio from '#/controls/Radio';
import Checkbox from '#/controls/Checkbox';
import Flex from '#/Flex';
import Text from '#/Text';
import Avatar from '#/display/Avatar';
import TableLeft from '#/_partial/TableLeft';
import TableRight from '#/_partial/TableRight';
import Table from '#/display/Table';
import TabBar from '#/_partial/TabBar';
import ButtonTroc from '#/controls/ButtonTroc';


// [[[[[[[[[]]]]]]]]]
// Icones
import { Circle, Home, Search, Arrowleft, Arrowright, Moon, Sun, Troc, Compass, Plus, Bubble } from '#/icons';
// [[[[[[[[[]]]]]]]]]


export default function Index() {
    const { theme, activeTheme, toggleTheme } = useTheme();
    const router = useRouter();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        canGoBack,
        onBack,
        label: 'Titre',
        rightArea: [
            {
                iconName: Search,
                onPress: () => alert('Recherche !'),
            },
            {
                iconName: Circle,
                onPress: () => alert('Icône !'),
            },
        ],
    });

    // Config de la navigation bar
    const navBarList = [
        { icon: <Troc filled /> },
        { icon: <Compass /> },
        { icon: <Plus /> },
        { icon: <Bubble /> },
        { avatar: { customImage: require('@/assets/icon.png'), focused: false } },
    ];

    const [switch1Checked, setSwitch1Checked] = useState(false);
    const [switch2Checked, setSwitch2Checked] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState<'option1' | 'option2' | null>(null);
    const [checkbox1Checked, setCheckbox1Checked] = useState(false);
    const [checkbox2Checked, setCheckbox2Checked] = useState(false);

    return (
        <Flex scroll gap={15} direction='column' style={[styles.container, { backgroundColor: activeTheme.colors.surface.primary }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            <Flex direction='row' gap={16}>
                <Text variant='title_Large'>le thème est : {theme}</Text>
                <Button
                    onPress={toggleTheme}
                    // icon={<Moon filled />}
                    icon={theme === 'light' ? <Sun /> : <Moon filled />}
                    iconPosition="left"
                    variant="outlined"
                    size="large"
                />
            </Flex>

            <Flex gap={16}>
                <Flex direction='row' gap={32} border>
                    <ButtonTroc type='pass' color='mono' />
                    <ButtonTroc type='like' color='mono' />
                    <ButtonTroc type='reroll' color='mono' />
                </Flex>
                <Flex direction='row' gap={32}>
                    <ButtonTroc type='pass' color='default' />
                    <ButtonTroc type='like' color='default' />
                    <ButtonTroc type='reroll' color='default' />
                </Flex>
            </Flex>

            {/* <Flex>
                <Table
                    leftProps={{
                        variant: 'icon',
                        leftText: 'Profil',
                        legendText: 'Admin',
                        icon: <Circle />,
                    }}
                    rightProps={{
                        variant: 'text',
                        rightText: 'Voir plus',
                        chevron: true,
                        active: true
                    }}
                />
            </Flex>

            <Flex border direction='row'>
                <Flex gap={5} style={{ alignItems: 'flex-start' }}>
                    <TableLeft
                        variant="empty"
                    />
                    <TableLeft
                        variant="empty"
                        legendText='Légende'
                    />
                    <TableLeft
                        variant="avatar"
                    />
                    <TableLeft
                        variant="avatar"
                        legendText='Légende'
                    />
                    <TableLeft
                        variant="icon"
                    />
                    <TableLeft
                        variant="icon"
                        legendText='Légende'
                        icon={<Home />}
                    />
                </Flex>
                <Flex gap={5} style={{ padding: 10, alignItems: 'flex-end' }}>
                    <TableRight
                        variant="empty"
                    />
                    <TableRight
                        variant="text"
                        active
                        chevron={true}
                    />
                    <TableRight
                        variant="icon"
                    />
                    <TableRight
                        variant="button"
                    />
                    <TableRight
                        variant="switch"
                    />
                    <TableRight
                        variant="checkbox"
                        icon={<Home />}
                    />
                    <TableRight
                        variant="radio"
                        icon={<Home />}
                    />
                    <TableRight
                        variant="timestamp"
                        icon={<Home />}
                    />
                </Flex>
            </Flex>

            <Flex direction='row' gap={10}>
                <Flex direction='row' gap={10}>
                    <Switch
                        checked={switch1Checked}
                        disabled={false}
                        onValueChange={() => setSwitch1Checked(!switch1Checked)}
                    />
                    <Switch
                        checked={switch2Checked}
                        disabled
                        onValueChange={() => setSwitch2Checked(!switch2Checked)}
                    />
                </Flex>
            </Flex>
            <Flex direction='row' gap={10}>
                <Flex direction='row' gap={10}>
                    <Radio
                        checked={selectedRadio === 'option1'}
                        disabled={false}
                        onValueChange={() => setSelectedRadio('option1')}
                    />
                    <Radio
                        checked={selectedRadio === 'option2'}
                        disabled
                        onValueChange={() => setSelectedRadio('option2')}
                    />
                    <Button label='reset' onPress={() => setSelectedRadio(null)} />
                </Flex>
            </Flex>
            <Flex direction='row' gap={10}>
                <Flex direction='row' gap={10}>
                    <Checkbox
                        checked={checkbox1Checked}
                        onValueChange={() => setCheckbox1Checked(!checkbox1Checked)}
                    />
                    <Checkbox
                        checked={checkbox2Checked}
                        disabled
                        onValueChange={() => setCheckbox2Checked(!checkbox2Checked)}
                    />
                </Flex>
            </Flex>

            <Avatar size="small" />
            <Flex
                scroll
                direction="row"
                gap={10}
                overflow='hidden'
                style={{
                    borderWidth: 1,
                    borderColor: 'red',

                    width: 300,
                    height: 'auto',
                }}
            >
                <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
                <View style={{ width: 100, height: 100, backgroundColor: 'blue' }} />
                <View style={{ width: 100, height: 100, backgroundColor: 'green' }} />
                <View style={{ width: 100, height: 100, backgroundColor: 'yellow' }} />
            </Flex>


            <Flex gap={10} direction="column" style={{ width: '100%' }}>

                <Flex direction="column">
                    <Button
                        label="Changer le thème"
                        onPress={toggleTheme}
                        icon={<Home />}
                        iconPosition="left"
                        variant="primary"
                        size="large"
                    />
                    <Button icon={<Home />} label="Secondary" variant='secondary'
                        size='large'
                        onPress={() => router.push(
                            {
                                pathname: '/auth/login',
                                params: { name: 'Clara' }
                            })
                        }
                    />
                    <Button icon={<Home />} label="Tertiary" variant='tertiary' size='large' />
                    <Button icon={<Home />} label="Outlined" variant='outlined' size='large' />
                    <Button icon={<Home />} label="Ghost" variant='ghost' size='large' />
                    <Button icon={<Home />} label="Désactivé" variant='primary' size='large' disabled={true} fullWidth />
                </Flex>

                <Flex gap={16} style={{ width: '100%', height: 100 }}>
                    <Image
                        style={styles.image}
                        source={require('@/assets/icon.png')}
                        contentFit="contain"
                        transition={1000}
                    />
                </Flex>

                <Flex gap={4} style={{ width: '100%' }}>
                    <Button label="Envoyer" variant="primary" size="small" />
                    <Button icon={<Home />} variant="secondary" size="small" />
                    <Button icon={<Home />} variant="secondary" size="large" />
                    <Button icon={<Home size={36} />} variant="primary" size="FAB" />
                    <Button label="Suivant" variant="tertiary" icon={<Arrowleft />} />
                    <Button label="Supprimer" variant="outlined" icon={<Arrowright />} iconPosition='right' />
                    <Button label="Supprimer" disabled variant="outlined" icon={<Arrowright />} iconPosition='right' fullWidth={true} />
                </Flex>
            </Flex> */}
        </Flex>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    image: {
        flex: 1,
        width: 100,
    },
});
