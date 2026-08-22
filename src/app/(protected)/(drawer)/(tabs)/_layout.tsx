import { Link, Tabs, useNavigation } from 'expo-router';
import { DrawerNavigationProp, useDrawerStatus } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Avatar from '#/display/Avatar';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Bubble, Compass, Plus, Preferences, Troc } from '#/icons';


const avatarImage = require('@/assets/icon.png');

const TAB_BAR_HEIGHT = 56;
const ICON_SIZE = 36;

const CreationTabButton = () => {
    const { activeTheme } = useTheme();

    return (
        <Link href="/modal/creation" asChild>
            <Pressable style={styles.tabBarButtonOdd}>
                <Plus size={ICON_SIZE} color={activeTheme.colors.icon.primary} />
            </Pressable>
        </Link>
    );
};

const AvatarTabButton = () => {
    const navigation = useNavigation<DrawerNavigationProp<ReactNavigation.RootParamList>>('/(protected)/(drawer)');
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
            style={styles.tabBarButtonOdd}
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

const TabBarButton = ({
    children,
    style,
    onPress,
    onPressIn,
    onPressOut,
    ...props
}: React.ComponentProps<typeof Pressable>) => {
    const { activeTheme } = useTheme();

    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            pressed.value,
            [0, 1],
            ['transparent', activeTheme.colors.surface.neutralLight],
        ),
    }));

    return (
        <Animated.View style={[styles.tabBarButtonContainer, scaleStyle]}>
            <Animated.View style={[styles.tabBarButton, backgroundStyle]}>
                <Pressable
                    {...props}
                    android_ripple={null}
                    onPress={(event) => {
                        onPress?.(event);
                    }}
                    onPressIn={(event) => {
                        scale.value = withTiming(0.9, {
                            duration: 100,
                            easing: Easing.out(Easing.quad),
                        });
                        pressed.value = withTiming(1, {
                            duration: 100,
                            easing: Easing.out(Easing.quad),
                        });
                        onPressIn?.(event);
                    }}
                    onPressOut={(event) => {
                        scale.value = withTiming(1, {
                            duration: 100,
                            easing: Easing.out(Easing.quad),
                        });
                        pressed.value = withTiming(0, {
                            duration: 100,
                            easing: Easing.out(Easing.quad),
                        });
                        onPressOut?.(event);
                    }}
                >
                    {children}
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const HomeHeader = () => {
    const { left, center, right } = useTopAppBar("_application", {
        onPress: () => console.log('Preferences'),
        iconName: Preferences,
    });

    return (
        <TopAppBar
            hasSafeAreaTop={false}
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
                    padding: 0,
                },
                tabBarShowLabel: false, // TODO, afficher les labels ou pas selon les settings d'accessibilité
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => <Troc filled={focused} size={ICON_SIZE} color={color} />,
                    header: () => <HomeHeader />,
                    tabBarButton: ({ children, onPress, style }) => (
                        <TabBarButton style={style} onPress={onPress}>
                            {children}
                        </TabBarButton>
                    ),
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, focused }) => <Compass filled={focused} size={ICON_SIZE} color={color} />,
                    tabBarButton: ({ children, onPress, style }) => (
                        <TabBarButton style={style} onPress={onPress}>
                            {children}
                        </TabBarButton>
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
                    tabBarIcon: ({ color, focused }) => <Bubble filled={focused} size={ICON_SIZE} color={color} />,
                    tabBarButton: ({ children, onPress, style }) => (
                        <TabBarButton style={style} onPress={onPress}>
                            {children}
                        </TabBarButton>
                    ),
                    headerShown: false,
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

const styles = StyleSheet.create({
    tabBarButtonContainer: {
        width: '100%',
        height: TAB_BAR_HEIGHT,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: 4,

        // borderWidth: 1,
        // backgroundColor: 'red',
        // zIndex: -1,

    },

    tabBarButton: {
        height: TAB_BAR_HEIGHT - 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: TAB_BAR_HEIGHT / 2,

        // borderWidth: 1,
        // backgroundColor: 'green',
    },

    tabBarButtonOdd: {
        height: TAB_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 1,
        // borderColor: 'red',
    }
});
