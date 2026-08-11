import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Drawer, DrawerContentScrollView } from 'expo-router/drawer';
import { router, Link } from 'expo-router';

import { useTheme } from '@/src/lib/hooks/useTheme';

import CustomSafeAreaView from '#/CustomSafeAreaView';

import Text from '#/Text';
import Flex from '#/Flex';
import Avatar from '#/display/Avatar';
import Table from '#/display/Table';
import Divider from '#/display/Divider';
import Fade from '#/miscellaneous/Fade';

import { Profile, Subscription, Heart, Star0, Troc, History, Assistance, Settings, Sun, Moon } from '#/icons';


const avatarImage = require('@/assets/icon.png');

const userNameMock = 'xLeay';

const CustomDrawer = React.memo((props: any) => {
    const { theme, activeTheme, toggleTheme } = useTheme();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={[styles.drawerContentContainer, {}]}
            style={[styles.drawerContent, { backgroundColor: activeTheme.colors.surface.secondary }]}
        >

            <Flex gap={32} style={{ flex: 1 }}>
                {/* Section */}
                <Flex gap={16} style={{ flex: 1, width: '100%', paddingBottom: 16 }}>
                    {/* Top */}
                    <Flex gap={4} style={{ width: '100%', paddingTop: 16, paddingHorizontal: 16 }}>
                        <Flex gap={4} alignItems='flex-start' style={{ width: '100%', paddingHorizontal: 16 }}>
                            <Avatar size="medium" customImage={avatarImage} onPress={() => {
                                router.push(`user/${userNameMock}`);
                            }} />
                            <Flex>
                                <Text variant='title_Small'>{userNameMock}</Text>
                            </Flex>
                            <Flex direction='row' alignItems='center' gap={8}>
                                <Link href={`/user/${userNameMock}/followers`}>
                                    <Flex gap={4} direction='row'>
                                        <Text variant='label_Large'>12</Text>
                                        <Text variant='body_Medium' type='secondary'>Abonnés</Text>
                                    </Flex>
                                </Link>

                                <Flex style={{ width: 3, height: 3, backgroundColor: activeTheme.colors.text.secondary, borderRadius: 3 }} />

                                <Link href={`/user/${userNameMock}/following`}>
                                    <Flex gap={4} direction='row'>
                                        <Text variant='label_Large'>18</Text>
                                        <Text variant='body_Medium' type='secondary'>Abonnements</Text>
                                    </Flex>
                                </Link>
                            </Flex>
                        </Flex>
                        <Divider padding style={{ marginTop: 16 }} />
                    </Flex>

                    <Flex style={{ width: '100%', flex: 1, position: 'relative' }}>
                        {/* Scrollable */}
                        <Flex scroll gap={8} style={{ width: '100%', flex: 1, position: 'relative' }}>
                            <Flex style={[styles.tableContainer]}>
                                <Link href={`/user/${userNameMock}`} asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Mon profil',
                                            icon: <Profile />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                                <Link href='shop/premium' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Premium',
                                            icon: <Subscription />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                                <Link href='favorites' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Favoris',
                                            icon: <Heart />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                                <Link href='evaluations' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Évaluations',
                                            icon: <Star0 />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                                <Link href='trocs' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Mes trocs',
                                            icon: <Troc />,
                                        }}
                                        rightProps={{
                                            variant: 'text',
                                            active: true,
                                            rightText: '14 nov.',
                                            chevron: false,
                                        }}
                                    />
                                </Link>
                                <Link href='history' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Historique',
                                            icon: <History />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                            </Flex>

                            <Divider padding />

                            <Flex style={[styles.tableContainer]}>
                                <Link href='help_center' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Centre d\'assistance',
                                            icon: <Assistance />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                                <Link href='settings/settings' asChild>
                                    <Table
                                        leftProps={{
                                            variant: 'icon',
                                            leftText: 'Paramètres',
                                            icon: <Settings />,
                                        }}
                                        rightProps={{
                                            variant: 'empty',
                                        }}
                                    />
                                </Link>
                            </Flex>
                        </Flex>
                        <Fade side="bottom" />
                    </Flex>
                </Flex>

                <Flex style={{ paddingVertical: 16, width: '100%' }}>
                    <Flex style={[styles.tableContainer]}>
                        <Table
                            leftProps={{
                                variant: 'icon',
                                leftText: theme === 'light' ? 'Mode clair' : 'Mode sombre',
                                icon: theme === 'light' ? <Sun /> : <Moon filled />,
                            }}
                            rightProps={{
                                variant: 'empty',
                            }}
                            onPress={() => {
                                toggleTheme();
                            }}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </DrawerContentScrollView>
    );
});

export default function Layout() {
    const { activeTheme } = useTheme();

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer
                    defaultStatus="closed"
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: {
                            backgroundColor: 'transparent',
                            width: '85%',
                        },
                        drawerPosition: 'right',
                        overlayColor: 'rgba(0,0,0,0.6)',
                        swipeEdgeWidth: 40,
                        swipeMinDistance: 40,
                        freezeOnBlur: true,
                    }}
                    drawerContent={(props) => <CustomDrawer {...props} />}
                />
            </GestureHandlerRootView>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    drawer: {

    },
    drawerContentContainer: {
        flex: 1,
        // backgroundColor: 'rgba(8, 82, 112, 0.1)',

        paddingTop: 0,
        paddingBottom: 0,
        paddingInlineStart: 0,
        paddingInlineEnd: 0,
    },
    drawerContent: {
        // borderWidth: 2,
        // borderColor: 'green',
    },
    drawerItem: {
        backgroundColor: 'tomato',
    },
    tableContainer: {
        width: '100%',
        paddingInline: 16,
    },


    tableList: {
        paddingHorizontal: 16,
        gap: 8,
    },
});