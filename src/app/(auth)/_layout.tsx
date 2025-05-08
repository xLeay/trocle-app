import React from 'react';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    const { activeTheme } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: activeTheme.colors.surface.secondary,
                },
                animation: 'none'
            }}
        />
    );
}
