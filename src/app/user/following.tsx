import { View, Text, StyleSheet } from 'react-native';

export default function Stack() {
    return (
        <View style={styles.container}>
            <Text>Mes Abonnements</Text>
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
