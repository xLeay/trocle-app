import { View, Text, StyleSheet } from 'react-native';

import Avatar from '#/display/Avatar';
import Button from '#/controls/Button';

import { useRouter } from 'expo-router';

import { Circle, Home, Search, Arrowleft, Arrowright, Moon, Sun, Troc, Compass, Plus, Bubble } from '#/icons';



export default function Tab() {

    const router = useRouter();

    const navBarList = [
        { icon: <Troc filled /> },
        { icon: <Compass /> },
        { icon: <Plus /> },
        { icon: <Bubble /> },
        { avatar: { customImage: require('@/assets/icon.png'), focused: false } },
    ];

    return (
        <View style={styles.container}>
            <Text>Tab Index</Text>
            <Avatar size="medium" />

            <Button label="Lien vers l'index de fou" variant="primary" size="small" onPress={() => {
                router.push('/home');
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
