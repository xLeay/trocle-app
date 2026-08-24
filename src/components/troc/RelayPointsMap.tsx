import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export interface RelayPoint {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface RelayPointsMapProps {
    relayPoints: RelayPoint[];
    selectedRelayId?: string;
    onSelectRelay: (relay: RelayPoint) => void;
    userLatitude: number;
    userLongitude: number;
}

export const RelayPointsMap: React.FC<RelayPointsMapProps> = ({
    relayPoints,
    selectedRelayId,
    onSelectRelay,
    userLatitude,
    userLongitude,
}) => {
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: userLatitude,
                    longitude: userLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {relayPoints.map((point) => {
                    const isSelected = point.id === selectedRelayId;
                    return (
                        <Marker
                            key={point.id}
                            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                            title={point.name}
                            description={point.address}
                            pinColor={isSelected ? 'blue' : 'red'}
                            onPress={() => onSelectRelay(point)}
                        />
                    );
                })}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});