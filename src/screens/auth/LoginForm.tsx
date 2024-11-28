import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import useLogin from '@/src/hooks/useLogin';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser, loading, error } = useLogin();

    const handleLogin = () => {
        loginUser(email, password);
    };

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
            {loading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Se connecter" onPress={handleLogin} />
            )}
            {error && <Text>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    form: { width: '100%', maxWidth: 400 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});
