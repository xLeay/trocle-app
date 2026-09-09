// store/locationStore.ts
import { LocationAddress } from '@/src/lib/utils/geocoding';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';
import { create } from 'zustand';

type LocationFetchResult =
    | { ok: true }
    | {
        ok: false;
        reason:
        | 'permission_denied'
        | 'services_disabled'
        | 'unavailable';
    };

interface LocationState {
    latitude: number | null
    longitude: number | null
    plainLocation: LocationGeocodedAddress | null
    error: string | null
    fetchLocation: () => Promise<LocationFetchResult>
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

    fetchLocation: async (): Promise<LocationFetchResult> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                set({
                    error: 'Permission refusée',
                    latitude: null,
                    longitude: null,
                    plainLocation: null,
                });

                return {
                    ok: false,
                    reason: 'permission_denied',
                };
            }

            const servicesEnabled = await Location.hasServicesEnabledAsync();

            if (!servicesEnabled) {
                set({
                    error: 'Le service de localisation est désactivé',
                });

                return {
                    ok: false,
                    reason: 'services_disabled',
                };
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.LocationAccuracy.Balanced,
            });

            let address: LocationGeocodedAddress | null = null;

            try {
                const addresses = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                address = addresses[0] ?? null;
            } catch {
                // Les coordonnées restent valides même si le géocodage échoue.
            }

            set({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                plainLocation: address,
                error: null,
            });

            return { ok: true };

        } catch (error) {
            console.log('Erreur fetchLocation :', error);

            set({
                error: 'Impossible de récupérer la position',
            });

            return {
                ok: false,
                reason: 'unavailable',
            };
        }
    },

    getLocationStatus: async () => {
        const { status } = await Location.getForegroundPermissionsAsync()
        return status
    }
}))
