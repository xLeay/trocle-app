import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

import Avatar from '#/display/Avatar';

import { Troc, Compass, Plus, Bubble } from '#/icons';
import Flex from '#/Flex';

export default function TabLayout() {

    const { activeTheme } = useTheme();

    return (
        <Tabs
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
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => <Troc filled={focused} size={36} color={color} />,
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, focused }) => <Compass filled={focused} size={36} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarButton: (props) => {
                        const router = useRouter();

                        return (
                            <Pressable
                                {...props}
                                onPress={() => router.push('/modal')}
                                style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Plus size={36} color={activeTheme.colors.icon.primary} />
                            </Pressable>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, focused }) => <Bubble filled={focused} size={36} color={color} />,
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
