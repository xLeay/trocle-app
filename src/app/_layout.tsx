import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { enableFreeze } from 'react-native-screens';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { useThemeStore } from '@/src/state/themeStore';

import { Provider as PortalProvider } from '#/Portal';
import Snackbar from '#/display/Snackbar';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function InnerApp() {
    const { theme, activeTheme } = useTheme();

    const initialized = useThemeStore((state) => state.initialized);
    const loadTheme = useThemeStore((state) => state.loadTheme);

    const [loaded, error] = useFonts({
        'RethinkSans-VariableFont_wght': require('@/assets/fonts/Rethink_Sans/RethinkSans-VariableFont_wght.ttf'),
        'RethinkSans-Italic-VariableFont_wght': require('@/assets/fonts/Rethink_Sans/RethinkSans-Italic-VariableFont_wght.ttf'),

        'RethinkSans-Regular': require('@/assets/fonts/Rethink_Sans/RethinkSans-Regular.ttf'),
        // 'RethinkSans-Italic': require('@/assets/fonts/Rethink_Sans/RethinkSans-Italic.ttf'),
        'RethinkSans-Medium': require('@/assets/fonts/Rethink_Sans/RethinkSans-Medium.ttf'),
        // 'RethinkSans-MediumItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-MediumItalic.ttf'),
        'RethinkSans-SemiBold': require('@/assets/fonts/Rethink_Sans/RethinkSans-SemiBold.ttf'),
        // 'RethinkSans-SemiBoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-SemiBoldItalic.ttf'),
        'RethinkSans-Bold': require('@/assets/fonts/Rethink_Sans/RethinkSans-Bold.ttf'),
        // 'RethinkSans-BoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-BoldItalic.ttf'),
        'RethinkSans-ExtraBold': require('@/assets/fonts/Rethink_Sans/RethinkSans-ExtraBold.ttf'),
        // 'RethinkSans-ExtraBoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-ExtraBoldItalic.ttf'),
    });

    // Activation de freeze pour optimiser les performances
    enableFreeze(true)

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        void loadTheme();
    }, [loadTheme]);

    if (!loaded && !error) { return null; }
    if (!initialized) { return null; }

    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                        <SystemBars style={theme === 'dark' ? 'light' : 'dark'} />
                        <Stack>
                            <Stack.Screen
                                name='(protected)'
                                options={{
                                    headerShown: false,
                                    animation: 'none',
                                    statusBarStyle: theme === 'dark' ? 'light' : 'dark'
                                }}
                            />
                            <Stack.Screen
                                name="(auth)"
                                options={{
                                    headerShown: false,
                                    statusBarStyle: theme === 'dark' ? 'light' : 'dark'
                                }}
                            />
                        </Stack>
                        <Snackbar />
                    </KeyboardProvider>
                </GestureHandlerRootView>
            </QueryClientProvider>
        </React.Fragment>
    )
}

export default function RootLayout() {
    return (
        <React.Fragment>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <PortalProvider>
                    <InnerApp />
                </PortalProvider>
            </SafeAreaProvider>
        </React.Fragment >
    );
}
