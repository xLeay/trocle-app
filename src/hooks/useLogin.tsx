import { useState } from 'react';
import { useAuthStore } from '../state/authStore';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/lib/routes/types';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthStore();
    const navigation = useNavigation<NavigationProp>();

    const loginUser = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            // Logique pour appeler l'API ou vérifier les credentials (ici, on le fait de manière simulée)
            const user = { email }; // Par exemple, après une API qui te retourne un utilisateur
            login(user); // Mettre l'utilisateur dans le store Zustand
            navigation.navigate('Home'); // Naviguer vers la page d'accueil
        } catch (err) {
            setError('Erreur lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return {
        loginUser,
        loading,
        error,
    };
};

export default useLogin;
