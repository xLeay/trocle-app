import { View, Text, StyleSheet } from 'react-native';

import NavigationBar from '#/bars/NavigationBar';


import { Circle, Home, Search, Arrowleft, Arrowright, Moon, Sun, Troc, Compass, Plus, Bubble } from '#/icons';



export default function Tab() {

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
            <NavigationBar navBarList={navBarList} />
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
