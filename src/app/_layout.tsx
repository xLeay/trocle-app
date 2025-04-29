
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/state/authStore';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import TopAppBar from '@/src/components/display/TopAppBar/TopAppBar';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';

// Composants
import Button from '#/controls/Button';

// [[[[[[[[[]]]]]]]]]
// Icones
import { ArrowLeft, Search, Home } from '#/icons';
// [[[[[[[[[]]]]]]]]]

import useTopAppBar from '@/src/hooks/useTopAppBar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { theme, activeTheme, toggleTheme } = useTheme();
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
        NavigationBar.setBackgroundColorAsync(activeTheme.colors.surface.secondary);
        NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
    }, [theme]);


    // Config de la top app bar
    const topAppBarConfig = "_layout";
    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        label: '_Layout',
    });

    if (!loaded && !error) { return null; }
    return (
        <React.Fragment>
            <SafeAreaProvider>
                <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary }}>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                    <Stack
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: activeTheme.colors.surface.secondary,
                            },
                            header: () => 
                            <TopAppBar
                                left={left}
                                center={center}
                                right={right}
                            />,
                        }
                        }
                    />
                    {/* <Stack.Screen
                    name="auth/login"
                    options={{
                        title: 'Connexion',
                    }}
                />
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Index',
                    }}
                /> */}
                    {/* </Stack> */}
                </SafeAreaView>
            </SafeAreaProvider>
        </React.Fragment >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
