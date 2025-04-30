import { Stack } from 'expo-router';

export default function ModalLayout() {
    return (
        <Stack screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="index" options={{ title: 'Créer un truc' }} />
        </Stack>
    );
}
