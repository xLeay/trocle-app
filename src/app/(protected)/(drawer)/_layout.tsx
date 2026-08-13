import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { router, Link, Href } from 'expo-router';
import { Drawer, DrawerContentScrollView, useDrawerStatus } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

import CustomSafeAreaView from '#/CustomSafeAreaView';

import Text from '#/Text';
import Flex from '#/Flex';
import Avatar from '#/display/Avatar';
import Table from '#/display/Table';
import Divider from '#/display/Divider';
import Fade from '#/miscellaneous/Fade';

import { Profile, Subscription, Heart, Star0, Troc, History, Assistance, Settings, Sun, Moon } from '#/icons';


type DrawerItemProps = {
    href: Href;
    label: string;
    icon: React.ReactNode;
    rightProps?: React.ComponentProps<typeof Table>['rightProps'];
};

function DrawerItem({
    href,
    label,
    icon,
    rightProps = { variant: 'empty' },
}: DrawerItemProps) {
    return (
        <Link href={href} asChild>
            <Table
                leftProps={{
                    variant: 'icon',
                    leftText: label,
                    icon,
                }}
                rightProps={rightProps}
            />
        </Link>
    );
}

const avatarImage = require('@/assets/icon.png');
const userNameMock = 'xLeay';

const mainItems = [
    {
        href: `/user/${userNameMock}`,
        label: 'Mon profil',
        icon: <Profile />,
    },
    {
        href: '/shop/premium',
        label: 'Premium',
        icon: <Subscription />,
    },
    {
        href: '/favorites',
        label: 'Favoris',
        icon: <Heart />,
    },
    {
        href: '/evaluations',
        label: 'Évaluations',
        icon: <Star0 />,
    },
    {
        href: '/trocs',
        label: 'Mes trocs',
        icon: <Troc />,
        rightProps: {
            variant: 'text',
            active: true,
            rightText: '14 nov.',
            chevron: false,
        },
    },
    {
        href: '/history',
        label: 'Historique',
        icon: <History />,
    },
] satisfies DrawerItemProps[];

const secondaryItems = [
    {
        href: '/help-center',
        label: "Centre d'assistance",
        icon: <Assistance />,
    },
    {
        href: '/settings',
        label: 'Paramètres',
        icon: <Settings />,
    },
] satisfies DrawerItemProps[];

const CustomDrawer = React.memo((props: any) => {
    const { activeTheme } = useTheme();

    const drawerStatus = useDrawerStatus();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (drawerStatus === 'open') {
            const idleCallbackId = requestIdleCallback(() => {
                setShowContent(true);
            }, { timeout: 250 });

            return () => cancelIdleCallback(idleCallbackId);
        }

        setShowContent(false);
    }, [drawerStatus]);

    return (
        <DrawerContentScrollView
            contentContainerStyle={[styles.drawerContentContainer, {}]}
            style={[styles.drawerContent, { backgroundColor: activeTheme.colors.surface.secondary }]}
            {...props}
        >
            {showContent && (
                <Animated.View
                    entering={FadeInRight
                        .duration(375)
                        .easing(Easing.out(Easing.quad))}
                    style={{ flex: 1 }}
                >
                    <DrawerContent />
                </Animated.View>
            )}
        </DrawerContentScrollView>
    );
});

const DrawerContent = React.memo(() => {
    const { theme, activeTheme, toggleTheme } = useTheme();

    return (
        <Flex gap={32} style={{ flex: 1 }}>
            {/* Section */}
            <Flex gap={16} style={{ flex: 1, width: '100%', paddingBottom: 16 }}>
                {/* Top */}
                <Flex gap={4} style={{ width: '100%', paddingTop: 16, paddingHorizontal: 16 }}>
                    <Flex gap={4} alignItems='flex-start' style={{ width: '100%', paddingHorizontal: 16 }}>
                        <Avatar size="medium" customImage={avatarImage} transition={0} onPress={() => {
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

                <Flex style={styles.container}>
                    <Flex scroll gap={8} style={styles.scrollContainer}>
                        <Flex style={styles.tableContainer}>
                            {mainItems.map((item) => (
                                <DrawerItem
                                    key={item.href}
                                    {...item}
                                />
                            ))}
                        </Flex>

                        <Divider padding />

                        <Flex style={styles.tableContainer}>
                            {secondaryItems.map((item) => (
                                <DrawerItem
                                    key={item.href}
                                    {...item}
                                />
                            ))}
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
    );
});


export default function Layout() {
    const { activeTheme } = useTheme();

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
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
                }}
                drawerContent={(props) => <CustomDrawer {...props} />}
            />
            {/* </GestureHandlerRootView> */}
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
    container: {
        width: '100%',
        flex: 1,
        position: 'relative',
    },
    scrollContainer: {
        width: '100%',
        flex: 1,
        position: 'relative',
    },
    tableContainer: {
        width: '100%',
        paddingInline: 16,
    },
});