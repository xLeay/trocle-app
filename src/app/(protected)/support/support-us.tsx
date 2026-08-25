import { Stack, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { Arrowleft } from '#/icons';

export default function SupportUs() {

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Nous soutenir',
    });

    return (
        <View style={styles.container}>
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
            <Text>Nous soutenir</Text>
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
