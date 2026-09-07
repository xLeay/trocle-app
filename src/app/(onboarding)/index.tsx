import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import {
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDebounce } from '@/src/lib/hooks/useDebounce';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { AVATAR_SIZE, optimizeImage } from '@/src/lib/utils/image';

import { getAvatarModeration, getAvatarModerationMessage } from '@/src/lib/api/avatar-moderation';
import { useBigCategories } from '@/src/queries/useCategoryQueries';
import { useCompleteOnboarding } from '@/src/queries/useOnboardingQueries';
import { useUsernameAvailability } from '@/src/queries/useUserQueries';

import { useAuthStore } from '@/src/state/authStore';
import { useLocationStore } from '@/src/state/locationStore';

import Button from '#/controls/Button';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';
import Text from '#/Text';

import AvatarSection from '#/onboarding/Avatar';
import BirthDate from '#/onboarding/BirthDate';
import Gender from '#/onboarding/Gender';
import LocationSection from '#/onboarding/Location';
import Preferences from '#/onboarding/Preferences';
import Username from '#/onboarding/Username';

import { Arrowleft, Image, Photo } from '#/icons';

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
    const [locationError, setLocationError] = useState<Error | string | null>(null);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [avatar, setAvatar] = useState<string | ImageSourcePropType | undefined>(undefined);
    const avatarSheetRef = useRef<BottomSheetRef>(null);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState<Error | string | null>(null);


    const completeOnboardingMutation = useCompleteOnboarding();

    const { latitude, longitude, fetchLocation } = useLocationStore();

    const [finishError, setFinishError] = useState<string | null>(null);





    // Vérification des données
    const isAgeValid = birthDate !== null;
    const isGenderValid = gender !== null;
    const [isCategoriesValid, setIsCategoriesValid] = useState(false);


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
                ? '3 à 30 caractères : lettres, chiffres et _'
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

        const {
            latitude: existingLatitude,
            longitude: existingLongitude,
        } = useLocationStore.getState();

        if (existingLatitude !== null && existingLongitude !== null) {
            setLocationEnabled(true);
            return;
        }

        await fetchLocation();

        const {
            latitude: currentLatitude,
            longitude: currentLongitude,
            error,
        } = useLocationStore.getState();

        if (
            error ||
            currentLatitude === null ||
            currentLongitude === null
        ) {
            setLocationEnabled(false);
            setLocationError(error ?? 'Impossible de récupérer ta position.');
            return;
        }

        setLocationEnabled(true);
        setLocationError(null);
    };


    //////////// Catégories
    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        error: categoriesError
    } = useBigCategories();

    const validateCategories = (categories: number[]) => {
        setIsCategoriesValid(categories.length >= 3);
    };

    //////////// Avatar
    const moderateAvatar = async (uri: string): Promise<boolean> => {
        try {
            const moderation = await getAvatarModeration(uri);

            if (!moderation.allowed) {
                setAvatarError(getAvatarModerationMessage(moderation.reason));
                return false;
            }

            // console.log("Moderation response: ", JSON.stringify(moderation));

            setAvatarError(null);
            return true;

        } catch (error) {
            setAvatarError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de vérifier la photo pour le moment.'
            );
            return false;
        }
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
        (currentStep === 'avatar') ||
        (currentStep === 'avatar-confirmation');

    // 3. Gestion du retour arrière
    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex((current) => current - 1);
        }

        // Si on est à la confirmation et qu'on a une photo, on revient à l'étape des catégories (pas besoin de revenir à l'étape d'ajout d'avatar)
        if (currentStep === "avatar-confirmation" && avatar) {
            setStepIndex((current) => current - 1);
        }
    };

    // 4. Finalisation (dernière étape)
    const handleFinish = async (avatarToUpload: string | ImageSourcePropType | undefined) => {
        if (loading) return;

        try {
            setLoading(true);
            setFinishError(null);

            if (
                avatarToUpload !== undefined &&
                typeof avatarToUpload !== 'string'
            ) {
                throw new Error(
                    'Le format de la photo de profil est invalide.'
                );
            }

            await completeOnboardingMutation.mutateAsync({
                username,
                birthDate,
                gender,
                otherGender,
                selectedCategories,
                avatarUri: avatarToUpload ?? null,
                latitude: locationEnabled ? latitude : null,
                longitude: locationEnabled ? longitude : null,
            });

            useAuthStore.getState().setHasCompletedOnboarding(true);

            router.replace('/(protected)/(drawer)/(tabs)');

        } catch (error) {
            console.error(
                'Erreur lors de la finalisation de l’onboarding :',
                error
            );

            const errorCode =
                typeof error === 'object' &&
                    error !== null &&
                    'code' in error
                    ? String(error.code)
                    : null;

            if (errorCode === '23505') {
                setFinishError(
                    'Ce pseudonyme vient d’être pris. Choisis-en un autre.'
                );

                const usernameStepIndex = STEPS.findIndex(
                    (step) => step.name === 'username'
                );

                setStepIndex(usernameStepIndex);
                return;
            }

            setFinishError(
                error instanceof Error
                    ? error.message
                    : 'Impossible de terminer ton inscription pour le moment.'
            );
        } finally {
            setLoading(false);
        }
    };

    // 5. Passage à l'étape suivante
    const handleContinue = (action: 'apply' | 'skip') => {
        // Les étapes obligatoires ne peuvent avancer que si elles sont valides.
        if (action === 'apply' && !canContinue) {
            return;
        }

        if (currentStep === "preferences") {
            if (avatar) {
                setStepIndex((current) => current + 2);
                return;
            }
        }

        // Étape d'ajout d'avatar.
        if (currentStep === 'avatar') {
            if (action === 'skip') {
                setAvatar(undefined);
                setAvatarError(null);
                void handleFinish(undefined);
                return;
            }

            avatarSheetRef.current?.present();
            return;
        }

        // Étape de confirmation de l'avatar.
        if (currentStep === 'avatar-confirmation') {
            if (action === 'skip') {
                avatarSheetRef.current?.present();
                return;
            }

            void handleFinish(avatar);
            return;
        }

        // « Passer » sur les autres étapes optionnelles.
        if (action === 'skip') {
            // Ajoute ici les réinitialisations nécessaires, si besoin.
            // Exemple : if (currentStep === 'location') setLocationEnabled(false);
        }

        // Dernière étape générique, par sécurité.
        if (stepIndex >= STEPS.length - 1) {
            void handleFinish(undefined);
            return;
        }

        // Toutes les autres étapes avancent normalement.
        setStepIndex((current) => current + 1);
    };

    const setApprovedAvatar = (uri: string) => {
        setAvatar(uri);

        // Après le premier ajout : avatar → avatar-confirmation.
        // Depuis avatar-confirmation : on remplace seulement la photo.
        if (currentStep === 'avatar') {
            setStepIndex((current) => current + 1);
        }
    };





    const handleAddAvatar = async (type: 'camera' | 'library') => {
        setLoadingAvatar(true);
        setAvatarError(null);

        try {
            if (type === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission caméra refusée');
                    setAvatarError(new Error('Permission caméra refusée'));
                    return;
                }

                const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

                if (result.canceled) {
                    setLoadingAvatar(false);
                    return;
                }

                const manipulated = await optimizeImage(
                    result.assets[0],
                    AVATAR_SIZE
                );

                if (!(await moderateAvatar(manipulated.uri))) {
                    setLoadingAvatar(false);
                    return;
                }

                setApprovedAvatar(manipulated.uri);
                return;

            } else if (type === 'library') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission galerie refusée');
                    setAvatarError(new Error('Permission galerie refusée'));
                    return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'images',
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

                if (!result.canceled) {
                    const processedAssets = await Promise.all(
                        result.assets.map(async (asset) => {

                            const manipulated = await optimizeImage(asset, AVATAR_SIZE);

                            return { ...asset, uri: manipulated.uri };
                        })
                    );

                    const selectedAvatar = processedAssets[0];

                    if (!(await moderateAvatar(selectedAvatar.uri))) {
                        setLoadingAvatar(false);
                        return;
                    }

                    setApprovedAvatar(selectedAvatar.uri);
                }
            }
        } finally {
            setLoadingAvatar(false);
        }
    };

    const getButtonLabel = () => {
        if (currentStep === 'welcome') return "Compris";
        if (stepIndex === STEPS.length - 1) return "C'est parti !";
        if (currentStep === 'preferences' && selectedCategories.length < 3) return `Choisis-en encore ${3 - selectedCategories.length}`;
        if (currentStep === 'avatar') return 'Ajouter une photo';
        return 'Continuer';
    };

    const showLabel = stepIndex === 0 ? null : `${stepIndex}/${STEPS.length - 1}`;


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
                            onChangeUsername={(value) => {
                                setUsername(value);
                                setFinishError(null);
                            }}
                            isCheckingUsername={isCheckingUsername}
                            isUsernameValid={isUsernameValid}
                            error={Boolean(usernameError || finishError)}
                            errorMessage={usernameError || finishError || ''}
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
                            locationError={locationError}
                        />
                    )}

                    {currentStep === 'preferences' && (
                        <Preferences
                            value={selectedCategories}
                            onChange={(nextCategories) => {
                                setSelectedCategories(nextCategories);
                                validateCategories(nextCategories);
                            }}
                            categories={categories}
                            isLoadingCategories={isCategoriesLoading}
                            categoriesError={categoriesError}
                        />
                    )}

                    {currentStep === 'avatar' && (
                        <AvatarSection
                            value={avatar}
                            isLoadingAvatar={loadingAvatar}
                            avatarError={avatarError}
                        />
                    )}

                    {currentStep === 'avatar-confirmation' && (
                        <AvatarSection
                            value={avatar}
                            isLoadingAvatar={loadingAvatar}
                            avatarError={avatarError}
                        />
                    )}
                </Flex>

                {finishError && currentStep !== 'username' && (
                    <Flex
                        fullWidth
                        style={{
                            paddingTop: activeTheme.spacing._200,
                        }}
                    >
                        <Text variant="body_Medium" type="secondary">
                            {finishError}
                        </Text>
                    </Flex>
                )}
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
                    disabled={!canContinue || loading || loadingAvatar}
                    loading={loading || loadingAvatar}
                    onPress={() => handleContinue('apply')}
                    fullWidth
                />
                {isStepOptional && (
                    <Button
                        label={currentStep === 'avatar-confirmation' ? "Changer la photo" : "Passer"}
                        variant="outlined"
                        size="large"
                        disabled={loadingAvatar}
                        onPress={() => handleContinue('skip')}
                        fullWidth
                    />
                )}
            </KeyboardStickyView>


            {/* Bottom sheet de la sélection de photo de profil */}
            <BottomSheet
                ref={avatarSheetRef}
                headerVariant="handle"
            >
                <Table
                    leftProps={{
                        leftText: 'Prendre une photo',
                        icon: <Photo />,
                        variant: 'icon',
                    }}
                    rightProps={{ variant: 'empty' }}
                    onPress={() => {
                        avatarSheetRef.current?.dismiss();
                        handleAddAvatar('camera');
                    }}
                />

                <Table
                    leftProps={{
                        leftText: 'Choisir une photo',
                        icon: <Image />,
                        variant: 'icon',
                    }}
                    rightProps={{ variant: 'empty' }}
                    onPress={() => {
                        avatarSheetRef.current?.dismiss();
                        handleAddAvatar('library');
                    }}
                />
            </BottomSheet>
        </CustomSafeAreaView>
    );
}
