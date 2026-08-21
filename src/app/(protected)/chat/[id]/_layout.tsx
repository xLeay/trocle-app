import { Stack } from 'expo-router'

import CustomSafeAreaView from '#/CustomSafeAreaView'
import { useTheme } from '@/src/lib/hooks/useTheme'

export default function ChatLayout() {
    const { activeTheme } = useTheme()

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Stack
                screenOptions={{
                    headerShown: true,
                }}
            />
        </CustomSafeAreaView>
    )
}