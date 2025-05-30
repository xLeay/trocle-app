import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

// Ce hook retourne une ref à passer à ton composant scrollable
export function useScrollToTopOnTabPress<T extends { scrollTo?: Function; scrollToOffset?: Function }>() {
    const ref = useRef<T>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            // Pour ScrollView/FlatList
            if (ref.current?.scrollTo) {
                ref.current.scrollTo({ y: 0, animated: true });
            }
            // Pour FlashList/FlatList
            if (ref.current?.scrollToOffset) {
                ref.current.scrollToOffset({ offset: 0, animated: true });
            }
        });
        return unsubscribe;
    }, [navigation]);

    return ref;
}
