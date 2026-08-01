import { Stack, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';


import NotificationsList from '#/messages/NotificationsList';

import { Arrowleft } from '#/icons';

import { MOCK_NOTIFICATIONS } from '@/src/mock/notifs.mock';


export default function Notifications() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Notifications',
    });

    return (
        <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}>
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            <NotificationsList notifications={MOCK_NOTIFICATIONS} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
