import React from 'react';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// TODO: Remove this when the React Native Safe Area Context is working and import the SafeAreaView from react-native-safe-area-context
import CustomSafeAreaView from '#/CustomSafeAreaView';

import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { theme, activeTheme, version } = useTheme();
    const router = useRouter();

    // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [loaded, error] = useFonts({
        'RethinkSans-VariableFont_wght': require('@/assets/fonts/Rethink_Sans/RethinkSans-VariableFont_wght.ttf'),
        'RethinkSans-Italic-VariableFont_wght': require('@/assets/fonts/Rethink_Sans/RethinkSans-Italic-VariableFont_wght.ttf'),

        'RethinkSans-Regular': require('@/assets/fonts/Rethink_Sans/RethinkSans-Regular.ttf'),
        'RethinkSans-Italic': require('@/assets/fonts/Rethink_Sans/RethinkSans-Italic.ttf'),
        'RethinkSans-Medium': require('@/assets/fonts/Rethink_Sans/RethinkSans-Medium.ttf'),
        'RethinkSans-MediumItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-MediumItalic.ttf'),
        'RethinkSans-SemiBold': require('@/assets/fonts/Rethink_Sans/RethinkSans-SemiBold.ttf'),
        'RethinkSans-SemiBoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-SemiBoldItalic.ttf'),
        'RethinkSans-Bold': require('@/assets/fonts/Rethink_Sans/RethinkSans-Bold.ttf'),
        'RethinkSans-BoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-BoldItalic.ttf'),
        'RethinkSans-ExtraBold': require('@/assets/fonts/Rethink_Sans/RethinkSans-ExtraBold.ttf'),
        'RethinkSans-ExtraBoldItalic': require('@/assets/fonts/Rethink_Sans/RethinkSans-ExtraBoldItalic.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        const applyNavigationBarStyle = async () => {
            try {
                await NavigationBar.setBackgroundColorAsync(activeTheme.colors.surface.secondary);
                await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
            } catch (e) {
                console.warn("Erreur lors du changement de style de la barre de navigation :", e);
            }
        };

        applyNavigationBarStyle();
    }, [theme, activeTheme.colors.surface.secondary, version]);

    // Client React Query
    const queryClient = new QueryClient();

    if (!loaded && !error) { return null; }
    return (
        <React.Fragment>
            <SafeAreaProvider>
                <CustomSafeAreaView style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary }}>
                    <QueryClientProvider client={queryClient}>
                        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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
                    </QueryClientProvider>
                </CustomSafeAreaView>
            </SafeAreaProvider>
        </React.Fragment >
    );
}
