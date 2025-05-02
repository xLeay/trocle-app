import { View, Text, StyleSheet } from 'react-native';

import Avatar from '#/display/Avatar';
import Button from '#/controls/Button';

import { useRouter } from 'expo-router';

import { Circle, Home, Search, Arrowleft, Arrowright, Moon, Sun, Troc, Compass, Plus, Bubble } from '#/icons';

export default function Tab() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text>Tab Index</Text>
            <Avatar size="medium" />

            <Button label="Lien vers l'index de fou" variant="primary" size="small" onPress={() => {
                router.push('/home/home');
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
    },
});
