import { useTheme } from '@/src/lib/hooks/useTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider as PortalProvider } from '#/Portal';

// TODO: Remove this when the React Native Safe Area Context is working and import the SafeAreaView from react-native-safe-area-context
// import CustomSafeAreaView from '#/CustomSafeAreaView';

import Snackbar from '#/display/Snackbar';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function InnerApp() {
    const { theme, activeTheme, initialized } = useTheme();

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

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    // useEffect(() => {
    //     SystemBars.setStyle('dark');
    // }, [theme]);

    if (!loaded && !error) { return null; }
    if (!initialized) { return null; }

    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                        <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary }}>
                            <BottomSheetModalProvider>
                                <SystemBars style={theme === 'dark' ? 'light' : 'dark'} />
                                <Stack>
                                    <Stack.Screen
                                        name='(protected)'
                                        options={{
                                            headerShown: false,
                                            animation: 'none'
                                        }}
                                    />
                                    <Stack.Screen
                                        name="(auth)"
                                        options={{
                                            headerShown: false,
                                        }}
                                    />
                                </Stack>
                                <Snackbar />
                            </BottomSheetModalProvider>
                        </SafeAreaView>
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
