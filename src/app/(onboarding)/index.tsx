import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDebounce } from '@/src/lib/hooks/useDebounce';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { useUsernameAvailability } from '@/src/queries/useUserQueries';

import Button from '#/controls/Button';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';
import Text from '#/Text';

import BirthDate from '#/onboarding/BirthDate';
import Gender from '#/onboarding/Gender';
import LocationSection from '#/onboarding/Location';
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
        description: 'Crée un pseudonyme d’au moins 3 caractères, sans espace. Les lettres, chiffres et underscores (_) sont acceptés.',
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
        optional: true
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


    // Données de l'onboarding (states)
    const [username, setUsername] = useState('');

    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [otherGender, setOtherGender] = useState('');

    const [locationEnabled, setLocationEnabled] = useState(false);

    const [avatar, setAvatar] = useState<string | null>(null);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


    // Vérification des données
    const isAgeValid = birthDate !== null;
    const isGenderValid = gender !== null;
    const [isCategoriesValid, setIsCategoriesValid] = useState(false);
    const [isAvatarValid, setIsAvatarValid] = useState(false);
    const [isNotificationsValid, setIsNotificationsValid] = useState(false);


    ////////// Nom d'utilisateur
    const normalizedUsername = username.trim().toLowerCase();
    const debouncedUsername = useDebounce(normalizedUsername, 400);

    const {
        data: usernameAvailability,
        isFetching: isCheckingUsername,
    } = useUsernameAvailability(debouncedUsername);

    const usernameError =
        username.length === 0
            ? ''
            : usernameAvailability?.reason === 'format'
                ? '3 à 30 caractères : lettres, chiffres, . et _'
                : usernameAvailability?.reason === 'reserved' || usernameAvailability?.reason === 'taken'
                    ? 'Ce pseudonyme n\'est pas disponible.'
                    : '';

    const isUsernameValid =
        usernameAvailability?.available === true &&
        normalizedUsername === debouncedUsername;



    //////////// Localisation
    const handleLocationToggle = async (enabled: boolean) => {
        if (!enabled) {
            setLocationEnabled(false);
            return;
        }

        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === 'granted') {
            setLocationEnabled(true);
            return;
        }

        setLocationEnabled(false);

        if (!permission.canAskAgain) {
            await Linking.openSettings();
        }
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
        (currentStep === 'location' && locationEnabled) ||
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

            // Enfin, lors de la création réelle du profil, refais quand même l’insertion avec le pseudo normalisé et gère une éventuelle erreur 23505 (unique violation). C’est indispensable : deux personnes peuvent voir le même pseudo disponible à la même milliseconde.

            //         const genderForDatabase =
            // gender === 'other'
            //     ? otherGender.trim()
            //     : gender;

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

            <KeyboardAwareScrollView
                contentContainerStyle={{
                    paddingHorizontal: activeTheme.spacing._200,
                    paddingTop: activeTheme.spacing._100,
                }}
                keyboardShouldPersistTaps="handled"
                bottomOffset={140} // marge de sécurité au-dessus du bouton
            >

                {/* Header */}
                <Flex gap={activeTheme.spacing._200}>
                    <Text variant="display_Small" type='primary'>{stepTitle}</Text>
                    <Text variant="body_Large" type='secondary'>{stepDescription}</Text>
                </Flex>

                {/* Contenu */}
                <Flex fullWidth style={{ flex: 1, paddingTop: activeTheme.spacing._400 }}>
                    {currentStep === 'username' && (
                        <Username
                            valueUsername={username}
                            onChangeUsername={setUsername}
                            isCheckingUsername={isCheckingUsername}
                            isUsernameValid={isUsernameValid}
                            error={Boolean(usernameError)}
                            errorMessage={usernameError}
                        />
                    )}

                    {currentStep === 'birthdate' && (
                        <BirthDate
                            value={birthDate}
                            onChange={setBirthDate}
                            minimumAge={18}
                            maximumAge={100}
                        />
                    )}

                    {currentStep === 'gender' && (
                        <Gender
                            value={gender}
                            onChange={setGender}
                            otherValue={otherGender}
                            onChangeOtherValue={setOtherGender}
                        />
                    )}

                    {currentStep === 'location' && (
                        <LocationSection
                            value={locationEnabled}
                            onValueChange={handleLocationToggle}
                        />
                    )}
                </Flex>
            </KeyboardAwareScrollView>

            {/* Boutons collés en bas (au-dessus du clavier quand il s'ouvre) */}
            <KeyboardStickyView
                offset={offset}
                style={{
                    paddingHorizontal: activeTheme.spacing._200,
                    paddingBottom: activeTheme.spacing._200,
                    gap: activeTheme.spacing._100,
                    backgroundColor: activeTheme.colors.surface.secondary,
                }}
            >
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
            </KeyboardStickyView>
        </CustomSafeAreaView>
    );
}
