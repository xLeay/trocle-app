export interface LocationAddress {
    label: string;      // Ex: "10 Rue de Paris 77100 Meaux"
    name: string;       // Ex: "10 Rue de Paris"
    city: string;       // Ex: "Meaux"
    postcode: string;   // Ex: "77100"
    department: string; // Ex: "Seine-et-Marne"
    latitude: number;
    longitude: number;
}

/**
 * Autocomplétion / Recherche d'adresses ou lieux (BAN)
 */
export async function searchAddress(query: string): Promise<LocationAddress[]> {
    if (!query || query.trim().length < 3) return [];

    try {
        const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        );
        if (!response.ok) return [];

        const data = await response.json();
        return data.features.map((f: any) => ({
            label: f.properties.label,
            name: f.properties.name,
            city: f.properties.city,
            postcode: f.properties.postcode,
            department: f.properties.context?.split(',')[1]?.trim() || '',
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
        }));
    } catch (error) {
        console.error('Erreur searchAddress:', error);
        return [];
    }
}

/**
 * Reverse Geocoding : Coordonnées (Lat, Lng) -> Adresse (BAN)
 */
export async function reverseGeocode(
    latitude: number,
    longitude: number
): Promise<LocationAddress | null> {
    try {
        const response = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
        );
        if (!response.ok) return null;

        const data = await response.json();
        if (!data.features || data.features.length === 0) return null;

        const feature = data.features[0];
        return {
            label: feature.properties.label,
            name: feature.properties.name,
            city: feature.properties.city,
            postcode: feature.properties.postcode,
            department: feature.properties.context?.split(',')[1]?.trim() || '',
            latitude,
            longitude,
        };
    } catch (error) {
        console.error('Erreur reverseGeocode:', error);
        return null;
    }
}

export function formatLocationAddress(location: LocationAddress) {
    const street =
        location.name && location.name !== location.city
            ? location.name
            : null;

    return [
        street,
        [location.postcode, location.city]
            .filter(Boolean)
            .join(', '),
    ]
        .filter(Boolean)
        .join(', ');
}