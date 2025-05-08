import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/src/state/authStore';
import { supabase } from '@/src/lib/supabase';

export default function ProtectedLayout() {
    const { activeTheme } = useTheme();
    const { session, initialized, fetchSession } = useAuthStore()

    useEffect(() => {
        fetchSession()
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            useAuthStore.setState({
                session,
                user: session?.user ?? null,
            })
        })

        const appStateListener = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                supabase.auth.startAutoRefresh()
            } else {
                supabase.auth.stopAutoRefresh()
            }
        })

        return () => {
            listener.subscription.unsubscribe()
            appStateListener.remove()
        }
    }, [])

    if (!initialized) return null
    if (!session) return <Redirect href={'/sign-in'} />

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: activeTheme.colors.surface.secondary,
                },
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="(drawer)"
            />
            <Stack.Screen
                name="user/profile"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="user/followers"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="user/following"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="home/home"
                options={{
                    title: "Accueil",
                }}
            />
            <Stack.Screen
                name="modal/creation"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="shop/premium"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="favorites"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="evaluations"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="trocs"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="history"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="help_center"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="settings/settings"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="product/[id]"
                options={{ headerShown: true, }}
            />
        </Stack>
    );
}
