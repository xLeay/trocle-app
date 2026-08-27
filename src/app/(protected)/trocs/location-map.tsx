import * as Location from 'expo-location';
import { Stack, router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Keyboard, Linking, StyleSheet } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useLocationStore } from '@/src/state/locationStore';

import { useDebounce } from '@/src/lib/hooks/useDebounce';
import { LocationAddress, searchAddress } from '@/src/lib/utils/geocoding';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import SearchBar from '#/bars/SearchBar';
import Button from '#/controls/Button';
import PressableOverlay from '#/controls/PressableOverlay';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { LocationPickerMap } from '#/troc/LocationPickerMap';

import { Arrowleft, Location as LocationIcon, Mylocation } from '#/icons';


export default function LocationMap() {
    const { activeTheme } = useTheme();

    const insets = useSafeAreaInsets();
    const offset = {
        closed: 0,
        opened: insets.bottom
    };

    const {
        fetchLocation,
        latitude,
        longitude,
        getLocationStatus,
        setTrocPropositionSelectedAddress,
        trocPropositionSelectedAddress
    } = useLocationStore();

    const [searchValue, setSearchValue] = useState('');
    const [predictions, setPredictions] = useState<LocationAddress[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [selectedLocation, setSelectedLocation] =
        useState<LocationAddress | null>(
            trocPropositionSelectedAddress,
        );

    const initialMapLatitude =
        selectedLocation?.latitude ??
        trocPropositionSelectedAddress?.latitude ??
        latitude;

    const initialMapLongitude =
        selectedLocation?.longitude ??
        trocPropositionSelectedAddress?.longitude ??
        longitude;

    const debouncedSearchValue = useDebounce(searchValue, 350);



    const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

    const [checkingPermission, setCheckingPermission] = useState(true);

    const previousAppState = useRef(AppState.currentState);


    const handleMapInteraction = () => {
        Keyboard.dismiss();
        setShowPredictions(false);
    };



    const checkPermission = useCallback(async () => {
        setCheckingPermission(true);

        try {
            const status = await getLocationStatus();
            setPermissionStatus(status);

            if (status !== 'granted') {
                setServicesEnabled(false);
                return;
            }

            const enabled = await Location.hasServicesEnabledAsync();
            setServicesEnabled(enabled);

            if (!enabled) {
                return;
            }

            // On récupère la position uniquement si elle n'existe pas encore.
            if (latitude === null || longitude === null) {
                await fetchLocation();
            }
        } catch (error) {
            console.log('Erreur localisation :', error);
            setServicesEnabled(false);
        } finally {
            setCheckingPermission(false);
        }

    }, [fetchLocation, getLocationStatus, latitude, longitude]);

    useEffect(() => {
        void checkPermission();

        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                const wasInBackground =
                    previousAppState.current !== 'active';

                const isNowActive = nextAppState === 'active';

                if (wasInBackground && isNowActive) {
                    void checkPermission();
                }

                previousAppState.current = nextAppState;
            },
        );

        return () => {
            subscription.remove();
        };
    }, [checkPermission]);



    useEffect(() => {
        let active = true;

        const fetchPredictions = async () => {
            const query = debouncedSearchValue.trim();

            if (query.length < 3) {
                setPredictions([]);
                setIsLoadingResults(false);
                return;
            }

            setIsLoadingResults(true);

            try {
                const results = await searchAddress(query);

                if (active) {
                    setPredictions(results);
                    setShowPredictions(true);
                }
            } finally {
                if (active) {
                    setIsLoadingResults(false);
                }
            }
        };

        void fetchPredictions();

        return () => {
            active = false;
        };
    }, [debouncedSearchValue]);

    useEffect(() => {
        if (trocPropositionSelectedAddress) {
            setSelectedLocation(trocPropositionSelectedAddress);
        }
    }, [trocPropositionSelectedAddress]);



    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Choisir un lieu',
    });

    return (
        <CustomSafeAreaView
            edges={['left', 'right']}
            style={{
                backgroundColor: activeTheme.colors.surface.secondary,
                position: "relative",
            }}
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

            {!checkingPermission &&
                permissionStatus === 'granted' &&
                servicesEnabled === true &&
                latitude !== null &&
                longitude !== null && (
                    <Flex fullWidth style={{
                        position: "relative",
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingBottom: activeTheme.spacing._100,
                        backgroundColor: activeTheme.colors.surface.secondary,
                        zIndex: 100,
                    }}>
                        <SearchBar
                            value={searchValue}
                            onChangeText={(text) => {
                                setSearchValue(text);
                                setSelectedLocation(null);
                            }}
                            onFocus={() => {
                                if (searchValue.trim().length >= 3) {
                                    setShowPredictions(true);
                                }
                            }}
                            onBlur={() => setShowPredictions(false)}
                            placeholder="Ville, code postal"
                        />


                        {showPredictions &&
                            searchValue.trim().length >= 3 && (
                                <Flex
                                    fullWidth
                                    style={{
                                        position: "absolute",
                                        top: '100%',
                                        marginTop: activeTheme.spacing._100,
                                        left: activeTheme.spacing._200,
                                        right: activeTheme.spacing._200,
                                        backgroundColor: activeTheme.colors.surface.primary,
                                        borderRadius: activeTheme.radius.card,
                                        zIndex: 20,
                                        elevation: 2,
                                        padding: activeTheme.spacing._100,
                                    }}
                                >
                                    {isLoadingResults && (
                                        <Flex
                                            fullWidth
                                            alignItems="center"
                                            style={{ padding: 16 }}
                                        >
                                            <ActivityIndicator color={activeTheme.colors.icon.brand} />
                                        </Flex>
                                    )}

                                    {!isLoadingResults &&
                                        predictions.map((prediction) => (
                                            <PressableOverlay
                                                key={`${prediction.latitude}-${prediction.longitude}-${prediction.label}`}
                                                onPress={() => {
                                                    setSearchValue(prediction.label);
                                                    setSelectedLocation(prediction);
                                                    setPredictions([]);
                                                    setShowPredictions(false);
                                                }}
                                                borderRadius={activeTheme.radius.default}
                                                style={{
                                                    padding: activeTheme.spacing._100,
                                                    width: '100%',
                                                }}
                                            >
                                                <Text variant="body_Medium" type="primary">
                                                    {prediction.name}
                                                </Text>

                                                <Text variant="body_Small" type="secondary">
                                                    {prediction.postcode} {prediction.city}
                                                </Text>
                                            </PressableOverlay>
                                        ))}

                                    {!isLoadingResults && predictions.length === 0 && (
                                        <Text
                                            variant="body_Small"
                                            type="secondary"
                                            style={{ padding: 16 }}
                                        >
                                            Aucun résultat trouvé
                                        </Text>
                                    )}
                                </Flex>
                            )}
                    </Flex>
                )}

            {checkingPermission && (
                <Flex
                    fullWidth
                    style={{ flex: 1, paddingHorizontal: activeTheme.spacing._200 }}
                    alignItems="center"
                    justifyContent="center"
                >
                    <ActivityIndicator
                        size="large"
                        color={activeTheme.colors.icon.brand}
                    />
                </Flex>
            )}

            {!checkingPermission &&
                (permissionStatus !== 'granted' || servicesEnabled === false) && (
                    <Flex
                        fullWidth
                        style={{ flex: 1, paddingHorizontal: activeTheme.spacing._200 }}
                        alignItems="center"
                        justifyContent="center"
                        gap={activeTheme.spacing._400}
                    >
                        <Text
                            variant="body_Large"
                            type="secondary"
                            style={{ textAlign: 'center' }}
                        >
                            {permissionStatus !== 'granted'
                                ? 'Autorise la localisation dans les réglages.'
                                : 'Active le service de localisation sur ton appareil.'}
                        </Text>
                        <Flex
                            direction="column"
                            alignItems="center"
                            gap={activeTheme.spacing._100}
                        >
                            <Button
                                label="Vérifier à nouveau"
                                variant="secondary"
                                icon={<LocationIcon />}
                                size="large"
                                onPress={() => {
                                    void checkPermission();
                                }}
                            />

                            <Button
                                label="Ouvrir les réglages"
                                variant="outlined"
                                size="large"
                                onPress={() => {
                                    void Linking.openSettings();
                                }}
                            />
                        </Flex>
                    </Flex>
                )}

            {!checkingPermission &&
                permissionStatus === 'granted' &&
                servicesEnabled === true &&
                latitude !== null &&
                longitude !== null && (
                    <Flex fullWidth style={styles.container}>
                        <LocationPickerMap
                            initialLatitude={initialMapLatitude}
                            initialLongitude={initialMapLongitude}
                            selectedLocation={selectedLocation}
                            onLocationSelect={(location) => {
                                setSelectedLocation(location);

                                // console.log(location);
                            }}
                            onInteraction={handleMapInteraction}
                        />
                    </Flex>
                )}

            <KeyboardStickyView
                offset={offset}
                style={{
                    // borderWidth: 1,
                    // borderColor: 'blue'
                }}
            >
                {permissionStatus === 'granted' &&
                    servicesEnabled === true &&
                    latitude !== null &&
                    longitude !== null && (
                        <Flex
                            direction="row"
                            fullWidth
                            alignItems="center"
                            justifyContent="flex-end"
                            gap={activeTheme.spacing._100}
                            style={{
                                position: 'absolute',
                                bottom: insets.bottom,
                                left: 0,
                                right: 0,
                                paddingHorizontal: activeTheme.spacing._200,
                                paddingVertical: activeTheme.spacing._200,
                            }}
                        >
                            <Button
                                label="Valider l'emplacement"
                                variant="primary"
                                size="large"
                                onPress={() => {
                                    if (!selectedLocation) {
                                        return;
                                    }

                                    setTrocPropositionSelectedAddress(selectedLocation);
                                    console.log(selectedLocation);

                                    router.back();
                                }}
                            />

                            <Button
                                variant="outlined"
                                size="large"
                                icon={<Mylocation />}
                                onPress={async () => {
                                    await fetchLocation();
                                }}
                            />
                        </Flex>
                    )}


            </KeyboardStickyView>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
