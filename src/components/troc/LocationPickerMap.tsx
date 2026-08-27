import { LocationAddress, reverseGeocode } from '@/src/lib/utils/geocoding';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';

interface LocationPickerMapProps {
    initialLatitude: number | null;
    initialLongitude: number | null;
    selectedLocation?: LocationAddress | null;
    onLocationSelect: (location: LocationAddress) => void;
    onInteraction?: () => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
    initialLatitude,
    initialLongitude,
    selectedLocation,
    onLocationSelect,
    onInteraction
}) => {
    const { activeTheme } = useTheme();

    const mapRef = useRef<MapView>(null);
    const isProgrammaticMove = useRef(false);

    const [loading, setLoading] = useState(false);
    const [addressLabel, setAddressLabel] = useState<string>('Déplacez la carte pour choisir un lieu');
    const lastFetchedRegion = useRef<{ lat: number; lng: number } | null>(null);

    const [isMoving, setIsMoving] = useState<boolean>(false);

    const handleRegionChangeComplete = useCallback(
        async (region: Region) => {
            setIsMoving(false);

            if (isProgrammaticMove.current) {
                isProgrammaticMove.current = false;
                return;
            }

            // Évite les requêtes inutiles si le mouvement est minime (< 40 mètres)
            if (lastFetchedRegion.current) {
                const latDiff = Math.abs(lastFetchedRegion.current.lat - region.latitude);
                const lngDiff = Math.abs(lastFetchedRegion.current.lng - region.longitude);
                if (latDiff < 0.0004 && lngDiff < 0.0004) return;
            }

            setLoading(true);
            lastFetchedRegion.current = { lat: region.latitude, lng: region.longitude };

            const locationData = await reverseGeocode(region.latitude, region.longitude);
            setLoading(false);



            if (locationData) {
                setAddressLabel(locationData.label);
                onLocationSelect(locationData);
            } else {
                setAddressLabel('Lieu inconnu');
            }
        },
        [onLocationSelect]
    );


    useEffect(() => {
        if (!selectedLocation) {
            return;
        }

        isProgrammaticMove.current = true;

        mapRef.current?.animateToRegion(
            {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            500,
        );

        setAddressLabel(selectedLocation.label);
    }, [selectedLocation]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: initialLatitude ?? 0,
                    longitude: initialLongitude ?? 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={onInteraction}
                onPanDrag={onInteraction}
                onRegionChangeStart={() => {
                    onInteraction?.();
                    setIsMoving(true);
                }}
                onRegionChangeComplete={handleRegionChangeComplete}
            />

            {/* Pin fixe au centre de la carte */}
            <Flex
                style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -10,
                    marginTop: -20,
                    position: 'absolute',
                    borderRadius: 10,

                    opacity: isMoving ? 0.6 : 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)'
                }}
                pointerEvents="none"
            >
                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: activeTheme.colors.surface.brand,
                        borderWidth: 2,
                        borderColor: activeTheme.colors.surface.primary,
                    }}
                />
            </Flex>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    card: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    addressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
});