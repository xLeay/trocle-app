import { useTheme } from '@/src/lib/hooks/useTheme';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/state/authStore';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
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
            screenOptions={{ headerShown: false, }}
        >
            <Stack.Screen
                name="(drawer)"
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="modal"
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="user/[username]"
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="chat/[id]"
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="settings"
                options={{ headerShown: false, }}
            />
        </Stack>
    );
}
