import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Button from '#/controls/Button';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';
import Text from '#/Text';

import Username from '#/onboarding/Username';

import { Arrowleft } from '#/icons';

export type Step = (typeof STEPS)[number];
export type StepName = Step['name'];

const STEPS = [
    {
        name: 'welcome',
        title: 'Bienvenue sur Trocle !',
        description: 'Pour qu’on apprenne à se connaître, je vais te guider à travers quelques étapes très simple.\n\nÇa te va ?',
        optional: false
    },
    {
        name: 'username',
        title: 'Comment je t’appelle ?',
        description: 'Crée un pseudonyme d’au moins 3 caractères, sans espace. Les lettres, chiffres, points (.) et underscores (_) sont acceptés.',
        optional: false
    },
    {
        name: 'birthdate',
        title: 'T’as quel âge ?',
        description: 'Tu peux utiliser ta propre date de naissance, tant que tu ne la partage pas, personne ne peut la voir.',
        optional: true
    },
    {
        name: 'gender',
        title: 'Ton sexe ?',
        description: 'Ça nous permet de te proposer une expérience personnalisée sur Trocle.',
        optional: false
    },
    {
        name: 'phone',
        title: 'T’as un 06 ?',
        description: 'Grâce à ton numéro, on peut te contacter si il y a un problème avec ton compte',
        optional: false
    },
    {
        name: 'location',
        title: 'Ta localisation ?',
        description: 'C’est important pour qu’on te présente des articles proches de toi. Trouve ton bonheur à portée de main !',
        optional: true
    },
    {
        name: 'preferences',
        title: 'Pourquoi tu veux utiliser Trocle ?',
        description: 'Ça nous aide à cibler ce qui t’intéresse sur l’application, même si on est plutôt curieux.',
        optional: true
    },
    {
        name: 'avatar',
        title: 'Tu veux ajouter une photo de profil ?',
        description: 'Avoir une photo de profil rend ton compte beaucoup plus professionnel, n’hésite pas !',
        optional: true
    },
    {
        name: 'avatar-confirmation',
        title: 'Ta photo a été ajoutée !',
        description: 'Tu vois, c\'est bien mieux comme ça.',
        optional: true
    },
] as const;


export default function OnboardingScreen() {
    const { activeTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const offset = { closed: 0, opened: insets.bottom };

    const [stepIndex, setStepIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const animatedProgress = useSharedValue(0);

    // Données de l'onboarding
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Vérification des données en temps réel
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isAgeValid, setIsAgeValid] = useState(false);
    const [isGenderValid, setIsGenderValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isLocationValid, setIsLocationValid] = useState(false);
    const [isCategoriesValid, setIsCategoriesValid] = useState(false);
    const [isAvatarValid, setIsAvatarValid] = useState(false);
    const [isNotificationsValid, setIsNotificationsValid] = useState(false);

    // Vérification du pseudo
    const validateUsername = (username: string) => {
        if (username.length < 3) {
            setIsUsernameValid(false);
            return;
        }

        setIsCheckingUsername(true);
        setTimeout(() => {
            setIsUsernameValid(true);
            setIsCheckingUsername(false);
        }, 1000);
    };

    // Vérification de l'âge
    const validateAge = (age: string) => {
        const ageNumber = parseInt(age, 10);
        if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 100) {
            setIsAgeValid(false);
            return;
        }
        setIsAgeValid(true);
    };

    // Vérification du sexe
    const validateGender = (gender: string) => {
        if (gender !== 'homme' && gender !== 'femme' && gender !== 'autre') {
            setIsGenderValid(false);
            return;
        }
        setIsGenderValid(true);
    };

    // Vérification du numéro de téléphone
    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setIsPhoneValid(false);
            return;
        }
        setIsPhoneValid(true);
    };

    // Vérification de la localisation
    const validateLocation = (location: string) => {
        if (location.length < 3) {
            setIsLocationValid(false);
            return;
        }
        setIsLocationValid(true);
    };

    // Vérification des catégories
    const validateCategories = (categories: string[]) => {
        if (categories.length === 0) {
            setIsCategoriesValid(false);
            return;
        }
        setIsCategoriesValid(true);
    };

    // Vérification de l'avatar
    const validateAvatar = (avatar: string) => {
        if (avatar.length < 3) {
            setIsAvatarValid(false);
            return;
        }
        setIsAvatarValid(true);
    };

    // Vérification des notifications
    const validateNotifications = (notifications: boolean) => {
        setIsNotificationsValid(true);
    };



    // Déduit automatiquement à chaque render selon stepIndex
    const currentStepData = STEPS[stepIndex];
    const currentStep = currentStepData.name;
    const stepTitle = currentStepData.title;
    const stepDescription = currentStepData.description;
    const isStepOptional = currentStepData.optional;

    // 2. Validation par étape
    const canContinue =
        (currentStep === 'welcome') ||
        (currentStep === 'username' && !isCheckingUsername && isUsernameValid) ||
        (currentStep === 'birthdate' && isAgeValid) ||
        (currentStep === 'gender' && isGenderValid) ||
        (currentStep === 'phone' && isPhoneValid) ||
        (currentStep === 'location' && isLocationValid) ||
        (currentStep === 'preferences' && isCategoriesValid) ||
        (currentStep === 'avatar' && isAvatarValid);

    // 3. Gestion du retour arrière
    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex((current) => current - 1);
        }
    };

    // 4. Finalisation (dernière étape)
    const handleFinish = async () => {
        try {
            setLoading(true);

            // TODO: Enregistrer les données dans Supabase
            // await supabase.from('profiles').update({
            //     username,
            //     avatar_url: avatar,
            //     has_completed_onboarding: true,
            // }).eq('id', user.id);

            // Redirection vers l'accueil de l'app
            router.replace('/(protected)/(drawer)/(tabs)');
        } finally {
            setLoading(false);
        }
    };

    // 5. Passage à l'étape suivante
    const handleContinue = (action: 'apply' | 'skip') => {
        // 1. Si on veut valider mais que le formulaire de l'étape n'est pas valide : on bloque
        if (action === 'apply' && !canContinue) {
            return;
        }

        // 2. Si on choisit de "Passer", on peut réinitialiser la donnée de l'étape si nécessaire
        if (action === 'skip') {
            if (currentStep === 'avatar') setAvatar(null);
            // if (currentStep === 'location') setLocation('');
            // etc.
        }

        // 3. Si on est sur la dernière étape : on enregistre et on redirige
        if (stepIndex === STEPS.length - 1) {
            void handleFinish();
            return;
        }

        // 4. Sinon, on avance simplement à l'étape suivante
        setStepIndex((current) => current + 1);
    };

    const getButtonLabel = () => {
        if (currentStep === 'welcome') return "Compris";
        if (stepIndex === STEPS.length - 1) return "C'est parti !";
        return 'Continuer';
    };

    const showLabel = stepIndex === 0 ? null : `${stepIndex}/${STEPS.length}`;


    useEffect(() => {
        animatedProgress.value = withTiming(stepIndex / (STEPS.length - 1), { duration: 400 });
    }, [stepIndex]);


    // Top App Bar
    const { left, center, right } = useTopAppBar('_withProgressBar', {
        iconName: Arrowleft,
        canGoBack: stepIndex > 0,
        onBack: handleBack,
        animatedProgress,
        progressBarType: 'primary',
        label: showLabel,
    });

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                fullWidth
                left={left}
                center={center}
                right={right}
            />
            <Flex
                fullWidth
                justifyContent="space-between"
                style={{
                    flex: 1,
                    paddingHorizontal: activeTheme.spacing._200,
                    paddingTop: activeTheme.spacing._100,
                }}
            >
                <Flex gap={activeTheme.spacing._200}>
                    <Text variant="display_Small" type='primary'>{stepTitle}</Text>
                    <Text variant="body_Large" type='secondary'>{stepDescription}</Text>
                </Flex>

                <KeyboardStickyView offset={offset} style={{ width: '100%', paddingBottom: activeTheme.spacing._200, borderWidth: 1, }}>
                    <Flex border fullWidth style={{ paddingTop: activeTheme.spacing._400 }}>
                        {currentStep === 'welcome' && (
                            <Flex />
                        )}
                        {currentStep === 'username' && (
                            <Username
                                valueUsername={username}
                                onChangeUsername={setUsername}
                                isCheckingUsername={isCheckingUsername}
                                isUsernameValid={isUsernameValid}
                                error={!isCheckingUsername && !isUsernameValid}
                                onFocus={() => setIsCheckingUsername(true)}
                                onBlur={() => setIsCheckingUsername(false)}
                            />
                        )}

                    </Flex>
                </KeyboardStickyView>

                {/* Bouton d'action persistant en bas */}
                <Button
                    label={getButtonLabel()}
                    variant="primary"
                    size="large"
                    disabled={!canContinue || loading}
                    loading={loading}
                    onPress={() => handleContinue('apply')}
                    fullWidth
                />
                {isStepOptional && (
                    <Button
                        label="Passer"
                        variant="outlined"
                        size="large"
                        onPress={() => handleContinue('skip')}
                        fullWidth
                    />
                )}
            </Flex>
        </CustomSafeAreaView>
    );
}
