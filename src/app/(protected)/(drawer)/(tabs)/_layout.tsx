import { useTheme } from '@/src/lib/hooks/useTheme';
import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Link, Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';

import Avatar from '#/display/Avatar';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import { Bubble, Compass, Plus, Preferences, Troc } from '#/icons';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';


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
    const navigation = useNavigation();
    const drawerStatus = useDrawerStatus();
    const isDrawerOpen = drawerStatus === 'open';
    const [isAvatarPressed, setIsAvatarPressed] = useState(false);

    useEffect(() => {
        if (!isDrawerOpen && isAvatarPressed) {
            setIsAvatarPressed(false);
        }
    }, [isDrawerOpen, isAvatarPressed]);

    const handlePress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
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
                name="avatarTab"
                options={{
                    title: 'AvatarTab',
                    tabBarButton: () => <AvatarTabButton />
                }}
            />
        </Tabs>
    );
}
