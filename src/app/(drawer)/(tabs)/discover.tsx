import { View, Text, StyleSheet } from 'react-native';

import Button from '#/controls/Button';
import { router } from 'expo-router';

export default function Tab() {
    return (
        <View style={styles.container}>
            <Text>Tab Discover</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
