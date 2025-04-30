import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import { useTheme } from '@/src/hooks/useTheme';

import Text from '#/Text';
import Flex from '#/Flex';
import Avatar from '#/display/Avatar';
import Table from '#/display/Table';

import { Profile, Subscription, Heart, Star0, Troc, History, Assistance, Settings } from '#/icons';


const CustomDrawer = (props: any) => {
    return (
        <DrawerContentScrollView {...props} style={[styles.drawerContent, {}]}>

            <Flex direction='row' border>
                <Text>Trocle</Text>
                <Avatar size="medium" customImage={require('@/assets/icon.png')} />
            </Flex>

            {/* TODO : Ajouter toutes les tables */}
            <Flex border>
                <Table
                    style={styles.table}
                    leftProps={{
                        variant: 'icon',
                        leftText: 'Mon profil',
                        icon: <Profile />,
                    }}
                    rightProps={{
                        variant: 'empty',
                    }}
                    onPress={() => {
                        router.push('/profile');
                    }}
                />
            </Flex>
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Mon profil</Text>}
                icon={() => <Profile />}
                onPress={() => {
                    router.push('/profile');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Premium</Text>}
                icon={() => <Subscription />}
                onPress={() => {
                    router.push('/premium');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Favoris</Text>}
                icon={() => <Heart />}
                onPress={() => {
                    router.push('/favorites');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Évaluations</Text>}
                icon={() => <Star0 />}
                onPress={() => {
                    router.push('/evaluations');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Mes trocs</Text>}
                icon={() => <Troc />}
                onPress={() => {
                    router.push('/trocs');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Historique</Text>}
                icon={() => <History />}
                onPress={() => {
                    router.push('/history');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Centre d'assistance</Text>}
                icon={() => <Assistance />}
                onPress={() => {
                    router.push('/help_center');
                }}
                style={[styles.drawerItem, {}]}
            />
            <DrawerItem
                label={() => <Text variant="body_Large" type='primary'>Paramètres</Text>}
                icon={() => <Settings />}
                onPress={() => {
                    router.push('/settings');
                }}
                style={[styles.drawerItem, {}]}
            />
        </DrawerContentScrollView>
    );
};

export default function Layout() {
    const { activeTheme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                defaultStatus="open"
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: activeTheme.colors.surface.secondary,
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
    drawerContent: {
        padding: 0,
        margin: 0,

        borderWidth: 1,
        borderColor: 'black',
    },
    drawerItem: {
        backgroundColor: 'tomato',
    },
    table: {

    },
});