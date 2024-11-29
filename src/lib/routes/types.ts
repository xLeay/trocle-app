
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Liste des paramètres de navigation (les routes)
export type NavigatorParams = {
    Home: undefined;
    Auth: undefined;
};

export type NavigationProp = NativeStackNavigationProp<NavigatorParams>