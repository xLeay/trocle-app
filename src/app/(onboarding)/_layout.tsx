import { useTheme } from '@/src/lib/hooks/useTheme';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    const { activeTheme } = useTheme();

    return (
        <Stack
            screenOptions={{ headerShown: false }}
        />
    );
}
