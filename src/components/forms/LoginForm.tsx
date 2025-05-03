import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import Text from '@/src/components/Text';

import Button from '@/src/components/controls/Button';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return (
        <View style={styles.form}>
            <TextInput
                placeholder="Adresse e-mail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Mot de passe"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
            />
            <Button label="Se connecter" variant='primary' size='large' fullWidth={false} />
        </View>
    );
}

const styles = StyleSheet.create({
    form: { width: '100%', maxWidth: 400, borderWidth: 3, borderColor: 'red'  },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});
