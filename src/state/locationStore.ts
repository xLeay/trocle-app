// store/locationStore.ts
import { LocationAddress } from '@/src/lib/utils/geocoding';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';
import { create } from 'zustand';

interface LocationState {
    latitude: number | null
    longitude: number | null
    plainLocation: LocationGeocodedAddress | null
    error: string | null
    fetchLocation: () => Promise<void>
    getLocationStatus: () => Promise<Location.PermissionStatus>
    trocPropositionSelectedAddress: LocationAddress | null;
    setTrocPropositionSelectedAddress: (address: LocationAddress | null) => void;
    clearTrocPropositionSelectedAddress: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    latitude: null,
    longitude: null,
    plainLocation: null,
    error: null,
    trocPropositionSelectedAddress: null,
    setTrocPropositionSelectedAddress: (address) => {
        set({ trocPropositionSelectedAddress: address });
    },
    clearTrocPropositionSelectedAddress: () => {
        set({ trocPropositionSelectedAddress: null })
    },
    fetchLocation: async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                set({ error: 'Permission refusée' });
                return;
            }

            const servicesEnabled =
                await Location.hasServicesEnabledAsync();

            if (!servicesEnabled) {
                set({
                    error: 'Le service de localisation est désactivé',
                });
                return;
            }

            const loc =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.LocationAccuracy.Balanced,
                });

            let address = null;

            try {
                const addresses =
                    await Location.reverseGeocodeAsync({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });

                address = addresses[0] ?? null;
            } catch {
                // Les coordonnées restent valides même si le géocodage échoue.
            }

            set({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                plainLocation: address,
                error: null,
            });
        } catch (error) {
            console.log('Erreur fetchLocation :', error);

            set({
                error: 'Impossible de récupérer la position',
            });
        }
    },
    getLocationStatus: async () => {
        const { status } = await Location.getForegroundPermissionsAsync()
        return status
    }
}))
