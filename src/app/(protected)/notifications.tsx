import { Stack, router } from 'expo-router';

import TopAppBar from '#/display/TopAppBar/TopAppBar';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import NotificationsList from '#/messages/NotificationsList';

import { Arrowleft } from '#/icons';

import { MOCK_NOTIFICATIONS } from '@/src/mock/notifs.mock';


export default function Notifications() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Notifications',
    });

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Stack.Screen
                options={{
                    headerShown: true,
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
        </CustomSafeAreaView>
    );
}
