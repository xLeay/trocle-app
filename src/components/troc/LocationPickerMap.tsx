import { LocationAddress, reverseGeocode } from '@/src/lib/utils/geocoding';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface LocationPickerMapProps {
    initialLatitude: number;
    initialLongitude: number;
    onLocationSelect: (location: LocationAddress) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
    initialLatitude,
    initialLongitude,
    onLocationSelect,
}) => {
    const [loading, setLoading] = useState(false);
    const [addressLabel, setAddressLabel] = useState<string>('Déplacez la carte pour choisir un lieu');
    const lastFetchedRegion = useRef<{ lat: number; lng: number } | null>(null);

    const handleRegionChangeComplete = useCallback(
        async (region: Region) => {
            // Évite les requêtes inutiles si le mouvement est minime (< 50 mètres)
            if (lastFetchedRegion.current) {
                const latDiff = Math.abs(lastFetchedRegion.current.lat - region.latitude);
                const lngDiff = Math.abs(lastFetchedRegion.current.lng - region.longitude);
                if (latDiff < 0.0005 && lngDiff < 0.0005) return;
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

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: initialLatitude,
                    longitude: initialLongitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onRegionChangeComplete={handleRegionChangeComplete}
            />

            {/* Pin fixe au centre de la carte */}
            <View style={styles.markerFixed} pointerEvents="none">
                <View style={styles.markerPin} />
            </View>

            {/* Overlay d'information sur le lieu sélectionné */}
            <View style={styles.card}>
                {loading ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <Text style={styles.addressText} numberOfLines={2}>
                        {addressLabel}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    markerFixed: {
        left: '50%',
        top: '50%',
        marginLeft: -12,
        marginTop: -24,
        position: 'absolute',
    },
    markerPin: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        borderWidth: 3,
        borderColor: '#FFF',
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