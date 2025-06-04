import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { LocationGeocodedAddress } from 'expo-location'

const useLocation = () => {
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [plainLocation, setPlainLocation] = useState<LocationGeocodedAddress | null>(null)
    const [error, setError] = useState<string | null>(null)

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        let response = null

        if (status !== 'granted') {
            setError('L\'autorisation pour accéder à votre position a été refusée')
            return
        }

        let location = await Location.getCurrentPositionAsync()
        if (location) {
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)

            response = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })

            setPlainLocation(response[0])
            console.log("La localisation est : ", response);

        }
    };

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setError('Permission refusée')
            return false
        }
        return true
    }

    useEffect(() => {
        getUserLocation()
    }, [])

    return { latitude, longitude, plainLocation, error, getUserLocation, requestLocationPermission }
}

export default useLocation