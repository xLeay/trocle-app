import { router, Stack } from 'expo-router';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import {
    Arrowleft,
} from '#/icons';


export default function Preferences() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Mes préférences',
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

            <Flex
                style={{ backgroundColor: activeTheme.colors.surface.secondary, flex: 1 }}
            >
                <Flex fullWidth gap={activeTheme.spacing._100}>
                    <Text>Mes préférences</Text>
                </Flex>
            </Flex>
        </CustomSafeAreaView>
    );
}
