import { View, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';

import useTopAppBar from '@/src/hooks/useTopAppBar';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft } from '#/icons';

export default function Trocs() {

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Mes trocs',
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
            <Text>Mes trocs</Text>
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
