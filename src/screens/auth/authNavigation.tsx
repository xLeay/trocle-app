import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';

import { useTheme } from '@/src/hooks/useTheme';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigation() {
    const { theme, activeTheme, toggleTheme } = useTheme();

    return (
        <AuthStack.Navigator screenOptions={{
            // contentStyle: { backgroundColor: activeTheme.colors.surface.secondary },
            contentStyle: { backgroundColor: 'transparent' },
        }}>
            <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    );
}
