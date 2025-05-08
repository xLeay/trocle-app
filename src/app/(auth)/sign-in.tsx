import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useAuthStore } from '@/src/state/authStore';

import Text from '#/Text';
import Flex from '#/Flex';
import TextField from '#/controls/TextField';
import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// [[[[[[[[[]]]]]]]]]
// Icones
import { Circle, Home, Search, Arrowleft, Arrowright } from '#/icons';
// [[[[[[[[[]]]]]]]]]

export default function SignInScreen() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        canGoBack,
        onBack,
        label: 'Page de connexion',
    });

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loading, session } = useAuthStore()

    useEffect(() => {
        if (session) {
            router.replace('/')
        }
    }, [session])

    async function handleSignIn() {
        await signIn(email.trim(), password.trim())
    }


    return (
        <Flex
            style={[styles.container, {
                backgroundColor: activeTheme.colors.surface.primary,
                paddingTop: activeTheme.spacing._800,
                paddingHorizontal: activeTheme.spacing._200,
            }]}
            justifyContent='space-between'
        >
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

            <Flex gap={activeTheme.spacing._200} alignItems='center' style={{ width: '100%' }}>
                <Flex gap={activeTheme.spacing._200} style={{ width: '100%' }}>
                    <TextField
                        placeholder={'Pseudonyme ou adresse email'}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        autoCapitalize={'none'}
                    />
                    <TextField
                        placeholder={'Mot de passe'}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        type='password'
                        autoCapitalize={'none'}
                    />
                </Flex>

                <Flex gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                    <Button label="Connexion" variant='primary' size='large' disabled={loading} loading={loading} onPress={() => handleSignIn()} fullWidth />
                </Flex>
            </Flex>

            <Flex style={{ width: '100%', paddingVertical: activeTheme.spacing._200 }}>
                <Button label="Créer un nouveau compte" variant='outlined' size='large' onPress={() => router.replace('/sign-up')} fullWidth />
            </Flex>
        </Flex>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
