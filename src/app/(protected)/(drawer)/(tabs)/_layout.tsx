import { useTheme } from '@/src/lib/hooks/useTheme';
import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Link, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import Avatar from '#/display/Avatar';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import { Bubble, Compass, Plus, Preferences, Troc } from '#/icons';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';



const TAB_BAR_HEIGHT = 56;

export default function TabLayout() {
    const { activeTheme } = useTheme();

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

    return (
        <Tabs
            backBehavior='history'
            screenOptions={{
                tabBarActiveTintColor: activeTheme.colors.icon.primary,
                tabBarInactiveTintColor: activeTheme.colors.icon.primary,
                tabBarStyle: {
                    height: TAB_BAR_HEIGHT,
                    borderTopWidth: 1,
                    borderColor: activeTheme.colors.surface.divider,
                    backgroundColor: activeTheme.colors.surface.secondary,
                    shadowColor: 'transparent',
                },
                tabBarShowLabel: false,
                tabBarIconStyle: {
                    height: TAB_BAR_HEIGHT - 10, // 10 pour compenser le padding de 5 natif
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => <Troc filled={focused} size={36} color={color} />,
                    header: () => <HomeHeader />,
                    tabBarButton: ({ children, onPress, style }) => (
                        <Pressable
                            onPress={onPress}
                            style={style}
                            android_ripple={null}
                        >
                            {children}
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, focused }) => <Compass filled={focused} size={36} color={color} />,
                    tabBarButton: ({ children, onPress, style }) => (
                        <Pressable
                            onPress={onPress}
                            style={style}
                            android_ripple={null}
                        >
                            {children}
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarButton: () => <Link href="/modal/creation" asChild>
                        <Pressable style={{
                            height: TAB_BAR_HEIGHT,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
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
                    tabBarButton: ({ children, onPress, style }) => (
                        <Pressable
                            onPress={onPress}
                            style={style}
                            android_ripple={null}
                        >
                            {children}
                        </Pressable>
                    ),
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
                                    height: TAB_BAR_HEIGHT,
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
