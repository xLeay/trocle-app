import { NavigationProp } from '@/src/lib/routes/types';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '@/src/components/Text';

import { useTheme } from '@/src/hooks/useTheme';


import Button from '#/Button';
import Home from '#/icons/HomeRounded';

export default function HomeScreen() {

    const { theme, activeTheme, toggleTheme } = useTheme();

    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={[styles.container]}>
            <Text variant='display_Large'>le thème est : {theme}</Text>

            <Button
                label="Changer le thème"
                onPress={toggleTheme}
                icon={<Home color={activeTheme.colors.icon.invert} />}
                iconPosition="left"
                variant="primary"
                size="large"
            />
            <Button label="Secondary" variant='secondary' size='large' onPress={() => navigation.navigate('Auth')} />
            <Button label="Tertiary" variant='tertiary' size='large' />
            <Button label="Outlined" variant='outlined' size='large' />
            <Button label="Ghost" variant='ghost' size='large' />
            <Button label="Désactivé" variant='primary' size='large' disabled={true} />
        </View>
    );
}




const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold' },
    iconsContainer: { flexDirection: 'row', alignItems: 'center' },
    iconWrapper: { justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 },
});
