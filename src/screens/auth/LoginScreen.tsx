import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from './LoginForm';

import Text from '@/src/components/Text';

import { useTheme } from '@/src/hooks/useTheme';


export default function LoginScreen() {

    const { theme, activeTheme, toggleTheme } = useTheme();

    return (
        <View style={[styles.container]}>
            <Text variant='display_Large'>Connexion</Text>
            <LoginForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
});
