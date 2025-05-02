import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Link, Tabs, useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

import Avatar from '#/display/Avatar';

import { Troc, Compass, Plus, Bubble, Arrowleft, Notification } from '#/icons';
import Flex from '#/Flex';
import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import useTopAppBar from '@/src/hooks/useTopAppBar';
import { Preferences } from '#/icons';

export default function TabLayout() {
    const { activeTheme } = useTheme();
    const router = useRouter();

    // Config de la top app bar
    // const topAppBarConfig = "_small";
    // const canGoBack = router.canGoBack();
    // const onBack = () => { canGoBack && router.back() };

    // const { left, center, right } = useTopAppBar(topAppBarConfig, {
    //     canGoBack,
    //     onBack,
    //     label: 'Titre',
    //     rightArea: [
    //         {
    //             iconName: Search,
    //             onPress: () => alert('Recherche !'),
    //         },
    //         {
    //             iconName: Circle,
    //             onPress: () => alert('Icône !'),
    //         },
    //     ],
    // });

    function HomeHeader() {
        const { left, center, right } = useTopAppBar("_application", {
            onPress: () => console.log('Preferences'),
            iconName: Preferences,
        });

        return (
            <TopAppBar
                left={left}
                center={center}
                right={right}
            />
        );
    }

    function DiscoverHeader() {
        const [search, setSearch] = useState('');
        const { left, center, right } = useTopAppBar("_search", {
            search: search,
            setSearch: setSearch,
            placeHolder: "Recherche",
        });

        return (
            <TopAppBar
                style={{ flex: 1 }}
                left={left}
                center={center}
                right={right}
            />
        );
    }

    function MessagesHeader() {
        const [search, setSearch] = useState('');
        const { left, center, right } = useTopAppBar("_search", {
            search: search,
            setSearch: setSearch,
            placeHolder: "Recherche",
        });

        return (
            <Flex direction="row" style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
                <TopAppBar
                    style={{ flex: 1 }}
                    left={left}
                    center={center}
                    right={right}
                />
                <Button icon={<Notification />} variant="ghost" size="small" onPress={() => console.log('Rechercher')} />
            </Flex>
        );
    }

    return (
        <Tabs
            backBehavior='history'
            screenOptions={{
                tabBarActiveTintColor: activeTheme.colors.icon.primary,
                tabBarInactiveTintColor: activeTheme.colors.icon.primary,
                tabBarStyle: {
                    height: 48,
                    borderTopWidth: 1,
                    borderColor: activeTheme.colors.surface.divider,
                    backgroundColor: activeTheme.colors.surface.secondary,
                    shadowColor: 'transparent',
                },
                tabBarShowLabel: false,
                tabBarIconStyle: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 0,
                },
                // headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => <Troc filled={focused} size={36} color={color} />,
                    header: () => <HomeHeader />,
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, focused }) => <Compass filled={focused} size={36} color={color} />,
                    header: () => <DiscoverHeader />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarButton: () => <Link href="/modal/creation" asChild>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Plus size={36} color={activeTheme.colors.icon.primary} />
                        </Pressable>
                    </Link>,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, focused }) => <Bubble filled={focused} size={36} color={color} />,
                    header: () => <MessagesHeader />,
                }}
            />
            <Tabs.Screen
                name="avatarTab"
                options={{
                    title: 'AvatarTab',
                    tabBarButton: () => {
                        const navigation = useNavigation();
                        const drawerStatus = useDrawerStatus();
                        const isDrawerOpen = drawerStatus === 'open';
                        const [isAvatarPressed, setIsAvatarPressed] = useState(false);

                        if (!isDrawerOpen && isAvatarPressed) {
                            setIsAvatarPressed(false);
                        }

                        return (
                            <Pressable
                                onPress={() => {
                                    navigation.dispatch(DrawerActions.openDrawer());
                                    setIsAvatarPressed(true);
                                }}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    size="tiny"
                                    focused={isAvatarPressed}
                                    touchable={false}
                                    customImage={require('@/assets/icon.png')}
                                />
                            </Pressable>
                        );
                    },
                }}
            />
        </Tabs>
    );
}
