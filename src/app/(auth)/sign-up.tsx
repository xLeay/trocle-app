import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useDebounce } from '@/src/lib/hooks/useDebounce';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useAuthStore } from '@/src/state/authStore';
import { useSnackbarStore } from '@/src/state/snackbarStore';

import Card from '#/Card';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import TextField from '#/controls/TextField';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Donecircle } from '#/icons';

import { useCheckEmailExists } from '@/src/queries/useUserQueries';

export default function SignUpScreen() {
    const { activeTheme } = useTheme();
    const { addSnackbar } = useSnackbarStore();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_medium', {
        canGoBack,
        onBack,
        label: 'Page d\'inscription',
    });

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const debouncedEmail = useDebounce(email, 500)
    const { data: checkEmailExists, isLoading: checkEmailExistsLoading } = useCheckEmailExists(debouncedEmail)

    const { signUp, loading, session } = useAuthStore()

    function getErrorMessage(err: any) {
        if (!err) return;
        console.log(err);
        switch (err.code) {
            case 'validation_failed':
                return 'L\'email ne respecte pas le format requis.'
            default:
                return 'Une erreur est survenue.'
        }
    }

    useEffect(() => {
        if (session) {
            router.replace('/')
        }
    }, [session])

    async function handleSignUp() {
        const { error } = await signUp(email.trim(), password.trim())
        if (error) {
            addSnackbar({
                message: getErrorMessage(error) || 'Une erreur est survenue.',
                type: 'error',
                position: 'bottom',
            })
        } else {
            addSnackbar({
                message: 'Inscription reussie.',
                type: 'success',
                position: 'bottom',
            })
        }
    }

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const emailValid = validateEmail(email)

    function validatePassword(password: string) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            digit: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        }
    }

    const passwordChecks = validatePassword(password)
    const isPasswordValid = Object.values(passwordChecks).every(Boolean)

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
                    backgroundColor: activeTheme.colors.surface.primary,
                    paddingTop: activeTheme.spacing._800,
                    paddingBottom: activeTheme.spacing._200,
                    paddingHorizontal: activeTheme.spacing._200,
                }]}
                justifyContent='space-between'
            >

                <Flex gap={activeTheme.spacing._200} alignItems='center' style={{ width: '100%' }}>
                    <Flex gap={activeTheme.spacing._200}>
                        <TextField
                            placeholder={'Adresse email'}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            autoCapitalize={'none'}
                            hasError={!emailValid && email.length > 0 || (emailValid && checkEmailExists?.id)}
                            legend={emailValid && checkEmailExists?.id ? 'Cet email est deja utilisé.' : ''}
                            keyboardType={'email-address'}
                        />
                        <TextField
                            placeholder={'Mot de passe'}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            type='password'
                            autoCapitalize={'none'}
                            hasError={!isPasswordValid && password.length > 0}
                        />
                    </Flex>

                    <Card gap={activeTheme.spacing._100} padding={activeTheme.spacing._200} border={false} backgroundColor={activeTheme.colors.surface.brandLight}>
                        <Text variant='body_Small'>Le mot de passe doit contenir au minimum :</Text>
                        <Flex style={{ width: '100%' }}>
                            {[
                                { label: '8 caractères', valid: passwordChecks.length },
                                { label: 'Une majuscule', valid: passwordChecks.uppercase },
                                { label: 'Une minuscule', valid: passwordChecks.lowercase },
                                { label: 'Un nombre', valid: passwordChecks.digit },
                                { label: 'Un caractère spécial', valid: passwordChecks.special },
                            ].map((item, idx) => (
                                <Flex
                                    key={idx}
                                    direction='row'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    style={{ width: '100%' }}
                                >
                                    <Flex
                                        direction='row'
                                        alignItems='center'
                                        gap={activeTheme.spacing._50}
                                    >
                                        <Text>•</Text>
                                        <Text
                                            variant='body_Small'
                                            type={item.valid ? 'brand' : 'primary'}
                                        >
                                            {item.label}
                                        </Text>
                                    </Flex>
                                    {item.valid ? <Donecircle size={18} color={activeTheme.colors.surface.brand} /> : <Flex />}
                                </Flex>
                            ))}
                        </Flex>
                    </Card>


                    <Flex gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                        <Button label="S'inscrire" variant='primary' size='large' disabled={!emailValid || !isPasswordValid || loading} loading={loading} onPress={() => handleSignUp()} fullWidth />
                    </Flex>
                </Flex>

                <Flex gap={activeTheme.spacing._200} style={{ width: '100%' }} alignItems='center'>
                    <Text style={{ textAlign: 'center' }}>
                        <Text variant='body_Small'>En créant un compte, tu confirmes que tu acceptes les <Text variant='body_Small' type='brand' onPress={() => router.push('/terms-and-conditions')} style={{ textDecorationLine: 'underline' }}>Termes et Conditions de Trocle</Text>, avoir lu la <Text variant='body_Small' type='brand' style={{ textDecorationLine: 'underline' }} onPress={() => router.push('/privacy-policy')}>Politique de confidentialité</Text> et avoir au moins 14 ans.</Text>
                    </Text>
                    <Button label="J'ai déjà un compte" variant='outlined' size='large' onPress={() => router.replace('/sign-in')} fullWidth />
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
