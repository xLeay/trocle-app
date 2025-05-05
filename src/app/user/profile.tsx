import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { Share } from '#/icons';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

export default function Profile() {
    const isPresented = router.canGoBack();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        canGoBack,
        onBack,
        label: '',
        rightArea: [
            {
                iconName: Share,
                onPress: () => alert('Partage !'),
            },
        ],
    });

    return (
        <View style={styles.container}>
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
            <Text>Profil depuis le drawer</Text>
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
