// import { RATIO_PRESETS } from '#/display/ImageRatio';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';

// import { useTheme } from '@/src/lib/hooks/useTheme';

// interface CityPreviewMapProps {
//     latitude: number;
//     longitude: number;
//     radiusInMeters?: number;
//     ratio?: keyof typeof RATIO_PRESETS;
// }

// export const CityPreviewMap: React.FC<CityPreviewMapProps> = ({
//     latitude,
//     longitude,
//     radiusInMeters = 1500, // Zone floue d'illustration (ex: 1.5km)
//     ratio = "3:2",
// }) => {

//     const { activeTheme } = useTheme()
//     return (
//         <View style={[styles.container, { aspectRatio: RATIO_PRESETS[ratio], borderRadius: activeTheme.radius.card, }]}>
//             <MapView
//                 provider={PROVIDER_GOOGLE}
//                 style={StyleSheet.absoluteFill}
//                 initialRegion={{
//                     latitude,
//                     longitude,
//                     latitudeDelta: 0.045,
//                     longitudeDelta: 0.045,
//                 }}
//                 scrollEnabled={false}
//                 zoomEnabled={false}
//                 pitchEnabled={false}
//                 rotateEnabled={false}
//             >
//                 {/* Cercle pour matérialiser la zone sans donner l'adresse exacte du vendeur */}
//                 <Circle
//                     center={{ latitude, longitude }}
//                     radius={radiusInMeters}
//                     fillColor="rgba(0, 122, 255, 0.15)"
//                     strokeColor="rgba(0, 122, 255, 0.5)"
//                     strokeWidth={1.5}
//                 />
//             </MapView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         width: '100%',
//         overflow: 'hidden',
//     },
// });



import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Geojson, PROVIDER_GOOGLE } from 'react-native-maps';

import { useTheme } from '@/src/lib/hooks/useTheme';

import { RATIO_PRESETS } from '#/display/ImageRatio';


interface CityPreviewMapProps {
    cityName: string; // Ex: "Meaux"
    ratio?: keyof typeof RATIO_PRESETS;
}

export const CityPreviewMap: React.FC<CityPreviewMapProps> = ({
    cityName,
    ratio = "3:2",
}) => {

    const { activeTheme } = useTheme()

    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        async function fetchCityPolygon() {
            try {
                // Interroge l'API Geo du gouvernement pour avoir le contour GeoJSON et le centre
                const response = await fetch(
                    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityName)}&fields=nom,centre,contour&boost=population&limit=1`
                );
                const data = await response.json();

                if (data && data.length > 0) {
                    const city = data[0];

                    // Coordonnées du centre [longitude, latitude] -> inverser pour MapView
                    setCenterCoords({
                        latitude: city.centre.coordinates[1],
                        longitude: city.centre.coordinates[0],
                    });

                    // Prépare l'objet GeoJSON standard attendu par react-native-maps
                    setGeoJsonData({
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: city.contour,
                                properties: {},
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Erreur récupération contours ville:', error);
            }
        }

        if (cityName) {
            fetchCityPolygon();
        }
    }, [cityName]);

    if (!centerCoords || !geoJsonData) {
        return (
            <View style={[styles.loadingContainer, { aspectRatio: RATIO_PRESETS[ratio], borderRadius: activeTheme.radius.card, }]}>
                <ActivityIndicator size="small" color={activeTheme.colors.surface.danger} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { aspectRatio: RATIO_PRESETS[ratio], borderRadius: activeTheme.radius.card, }]}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: centerCoords.latitude,
                    longitude: centerCoords.longitude,
                    latitudeDelta: 0.08, // Adapté pour voir une commune entière
                    longitudeDelta: 0.08,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}

                // Pour rendre une map statique, si on veut bouger dans la map par la suite, à enlever.
                liteMode={true}
            >
                <Geojson
                    geojson={geoJsonData}
                    strokeColor={activeTheme.colors.surface.danger}
                    fillColor={`${activeTheme.colors.surface.danger}25`}
                    strokeWidth={1}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    loadingContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
});