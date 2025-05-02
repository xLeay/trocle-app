import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router, Link } from 'expo-router';

import { useTheme } from '@/src/hooks/useTheme';

import Text from '#/Text';
import Flex from '#/Flex';
import Avatar from '#/display/Avatar';
import Table from '#/display/Table';
import Divider from '#/display/Divider';
import Fade from '#/miscellaneous/Fade';

import { Profile, Subscription, Heart, Star0, Troc, History, Assistance, Settings, Sun, Moon } from '#/icons';

const CustomDrawer = (props: any) => {
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
                            <Avatar size="medium" customImage={require('@/assets/icon.png')} onPress={() => {
                                router.push('profile');
                            }} />
                            <Flex>
                                <Text variant='title_Small'>xLeay</Text>
                            </Flex>
                            <Flex direction='row' gap={8}>
                                <Link href='/user/followers'>
                                    <Flex gap={4} direction='row'>
                                        <Text variant='label_Large'>12</Text>
                                        <Text variant='body_Medium' type='secondary'>Abonnés</Text>
                                    </Flex>
                                </Link>

                                <Flex style={{ width: 3, height: 3, backgroundColor: activeTheme.colors.text.secondary, borderRadius: 3 }} />

                                <Link href='/user/following'>
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
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Mon profil',
                                        icon: <Profile />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('user/profile');
                                    }}
                                />
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Premium',
                                        icon: <Subscription />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('premium');
                                    }}
                                />
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Favoris',
                                        icon: <Heart />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('favorites');
                                    }}
                                />
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Évaluations',
                                        icon: <Star0 />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('evaluations');
                                    }}
                                />
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
                                    onPress={() => {
                                        router.push('trocs');
                                    }}
                                />
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Historique',
                                        icon: <History />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('history');
                                    }}
                                />
                            </Flex>

                            <Divider padding />

                            <Flex style={[styles.tableContainer]}>
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Centre d\'assistance',
                                        icon: <Assistance />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('help_center');
                                    }}
                                />
                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Paramètres',
                                        icon: <Settings />,
                                    }}
                                    rightProps={{
                                        variant: 'empty',
                                    }}
                                    onPress={() => {
                                        router.push('settings');
                                    }}
                                />
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
};

export default function Layout() {
    return (
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

                }}
                drawerContent={(props) => <CustomDrawer {...props} />}
            />
        </GestureHandlerRootView>
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
});