import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useAuthStore } from '@/src/state/authStore';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Button from '#/controls/Button';
import TextField from '#/controls/TextField';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// [[[[[[[[[]]]]]]]]]
// Icones
// import { Circle, Home, Search, Arrowleft, Arrowright } from '#/icons';
// [[[[[[[[[]]]]]]]]]

import { useSnackbarStore } from '@/src/state/snackbarStore';

export default function SignInScreen() {
    const { activeTheme } = useTheme();
    const { addSnackbar } = useSnackbarStore();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar("_medium", {
        canGoBack,
        onBack,
        label: 'Page de connexion',
    });

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loading, session } = useAuthStore()

    function getErrorMessage(err: any) {
        if (!err) return;
        switch (err.code) {
            case 'validation_failed':
                return 'L\'email ne respecte pas le format requis.'
            case 'invalid_credentials':
                return 'Les identifiants sont incorrects.'
            default:
                return 'Une erreur est survenue.'
        }
    }

    useEffect(() => {
        if (session) {
            router.replace('/')
        }
    }, [session])

    async function handleSignIn() {
        const { error } = await signIn(email.trim(), password.trim())
        if (error) {
            addSnackbar({
                message: getErrorMessage(error) || 'Une erreur est survenue.',
                type: 'error',
                position: 'bottom',
            })
        } else {
            addSnackbar({
                message: 'Connexion reussie.',
                type: 'success',
                position: 'bottom',
            })
        }
    }

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                fullWidth
                left={left}
                center={center}
                right={right}
            />
            <Flex
                style={[styles.container, {
                    // backgroundColor: activeTheme.colors.surface.primary,
                    paddingTop: activeTheme.spacing._800,
                    paddingHorizontal: activeTheme.spacing._200,
                }]}
                justifyContent='space-between'
            >

                <Flex gap={activeTheme.spacing._200} alignItems='center' style={{ width: '100%' }}>
                    <Flex gap={activeTheme.spacing._200} style={{ width: '100%' }}>
                        <TextField
                            placeholder={'Pseudonyme ou adresse email'}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
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

        </CustomSafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
