import { View, StyleSheet } from 'react-native';
import { Stack, router, useRoute } from 'expo-router';

import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft } from '#/icons';

export default function Product() {

    const route = useRoute();
    const { id } = route.params as { id: string };

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Paramètres',
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
            <Text variant='display_Large'>Produit {id}</Text>
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
