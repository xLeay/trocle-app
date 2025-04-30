import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../../components/forms/LoginForm';

import Text from '#/Text';
import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { useTheme } from '@/src/hooks/useTheme';
import useTopAppBar from '@/src/hooks/useTopAppBar';
import { router, Stack, useLocalSearchParams } from 'expo-router';

// [[[[[[[[[]]]]]]]]]
// Icones
import { Circle, Home, Search, Arrowleft, Arrowright } from '#/icons';
// [[[[[[[[[]]]]]]]]]

export default function LoginScreen() {
    const { activeTheme } = useTheme();
    const params = useLocalSearchParams<{ name?: string }>();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        canGoBack,
        onBack,
        label: 'Titre',
        rightArea: [
            {
                iconName: Search,
                onPress: () => alert('Recherche !'),
            },
            {
                iconName: Circle,
                onPress: () => alert('Icône !'),
            },
        ],
    }); 

    return (
        <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.primary }]}>
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />
            <Text variant='display_Large'>Connexion</Text>
            <Text variant='label_Small'>{params.name}</Text>
            <LoginForm />

            <Button label='Retour' onPress={() => { router.back() }} variant='secondary' size='large' />
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
