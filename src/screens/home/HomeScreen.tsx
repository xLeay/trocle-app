import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Accessibility from '#/icons/AccessibilityRounded';
import Ad from '#/icons/AdRounded';
import Alert2 from '#/icons/Alert2Rounded';
import Home from '#/icons/HomeRounded';
import Lock from '#/icons/LockRounded';
import HeartRounded from '#/icons/HeartRounded';

export default function HomeScreen() {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue sur Trocle !</Text>

            <Home />
            <Button title="Connexion" onPress={() => navigation.navigate('Auth')} />
        </View>
    );
}




const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold' },
    iconsContainer: { flexDirection: 'row', alignItems: 'center' },
    iconWrapper: { justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 },
});
