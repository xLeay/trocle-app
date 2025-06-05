// store/locationStore.ts
import { create } from 'zustand'
import * as Location from 'expo-location'
import { LocationGeocodedAddress } from 'expo-location'

interface LocationState {
    latitude: number | null
    longitude: number | null
    plainLocation: LocationGeocodedAddress | null
    error: string | null
    fetchLocation: () => Promise<void>
}

export const useLocationStore = create<LocationState>((set) => ({
    latitude: null,
    longitude: null,
    plainLocation: null,
    error: null,
    fetchLocation: async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            set({ error: "Permission refusée" })
            return
        }

        const loc = await Location.getCurrentPositionAsync()
        const [address] = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        })

        set({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            plainLocation: address,
            error: null
        })
    }
}))
