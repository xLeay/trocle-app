export interface LocationDetails {
    city: string;
    postalCode: string;
    department: string;
    departmentCode: string;
    region: string;
}

export async function fetchLocationDetails(cityName: string): Promise<LocationDetails | null> {
    if (!cityName.trim()) return null;

    try {
        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityName)}&fields=nom,codesPostaux,departement,region,centre&boost=population&limit=1`
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (!data || data.length === 0) return null;

        const cityData = data[0];

        return {
            city: cityData.nom,
            postalCode: cityData.codesPostaux[0],
            department: cityData.departement.nom,
            departmentCode: cityData.departement.code,
            region: cityData.region.nom,
        };
    } catch (error) {
        console.error("Erreur géolocalisation:", error);
        return null;
    }
}