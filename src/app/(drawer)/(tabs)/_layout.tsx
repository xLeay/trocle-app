import { Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';

import Avatar from '#/display/Avatar';

import { Circle, Home, Search, Arrowleft, Arrowright, Moon, Sun, Troc, Compass, Plus, Bubble } from '#/icons';

export default function TabLayout() {

    const { theme, activeTheme, toggleTheme } = useTheme();

    const navBarList = [
        { icon: <Troc filled /> },
        { icon: <Compass /> },
        { icon: <Plus /> },
        { icon: <Bubble /> },
        { avatar: { customImage: require('@/assets/icon.png'), focused: false } },
    ];


    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeTheme.colors.icon.primary,
                tabBarInactiveTintColor: activeTheme.colors.icon.primary,
                tabBarShowLabel: false,
            }}>
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
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Plus size={36} />
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
                name="profile"
                options={{
                    tabBarButton: (props) => (
                        <Pressable
                            // onPress={() => navigation.openDrawer()}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Avatar size="tiny" customImage={require('@/assets/icon.png')} />
                        </Pressable>
                    ),
                }}
            />
        </Tabs>
    );
}
