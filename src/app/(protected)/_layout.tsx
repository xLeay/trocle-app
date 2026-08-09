import { useTheme } from '@/src/lib/hooks/useTheme';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/state/authStore';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState, } from 'react-native';

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
                name="modal"
                options={{ headerShown: false, }}
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
            <Stack.Screen
                name="notifications"
                options={{ headerShown: true, }}
            />
            <Stack.Screen
                name="chat/[id]/index"
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="chat/[id]/details"
                options={{ headerShown: true }}
            />

        </Stack>
    );
}
