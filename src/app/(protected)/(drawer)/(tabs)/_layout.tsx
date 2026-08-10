import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { Link, Tabs, useNavigation } from 'expo-router';

import { useDrawerStatus } from 'expo-router/drawer';
import type { DrawerNavigationProp } from 'expo-router/drawer';


import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Avatar from '#/display/Avatar';

import { Bubble, Compass, Plus, Preferences, Troc } from '#/icons';


const avatarImage = require('@/assets/icon.png');

const TAB_BAR_HEIGHT = 56;


const CreationTabButton = () => {
    const { activeTheme } = useTheme();

    return (
        <Link href="/modal/creation" asChild>
            <Pressable style={{
                height: TAB_BAR_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Plus size={36} color={activeTheme.colors.icon.primary} />
            </Pressable>
        </Link>
    );
};

const AvatarTabButton = () => {
    const navigation = useNavigation<DrawerNavigationProp<ReactNavigation.RootParamList>>();
    const drawerStatus = useDrawerStatus();
    const isDrawerOpen = drawerStatus === 'open';
    const [isAvatarPressed, setIsAvatarPressed] = useState(false);

    useEffect(() => {
        if (!isDrawerOpen && isAvatarPressed) {
            setIsAvatarPressed(false);
        }
    }, [isDrawerOpen, isAvatarPressed]);

    const handlePress = () => {
        navigation.openDrawer();
        setIsAvatarPressed(true);
    };

    return (
        <Pressable
            onPress={handlePress}
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
                customImage={avatarImage}
            />
        </Pressable>
    );
};

const HomeHeader = () => {
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

export default function TabLayout() {
    const { activeTheme } = useTheme();

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
                    tabBarButton: () => <CreationTabButton />
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
                name="avatar-tab"
                options={{
                    title: 'Avatar Tab',
                    tabBarButton: () => <AvatarTabButton />
                }}
            />
        </Tabs>
    );
}
