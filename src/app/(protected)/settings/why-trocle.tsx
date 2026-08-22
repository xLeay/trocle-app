import { router, Stack } from 'expo-router';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import {
    Arrowleft,
} from '#/icons';


export default function WhyTrocle() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Pourquoi utiliser Trocle',
    });

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            <Flex
                scroll
                style={{ backgroundColor: activeTheme.colors.surface.secondary, flex: 1 }}
            >
                <Flex fullWidth gap={activeTheme.spacing._200} style={{
                    padding: activeTheme.spacing._200,
                }}>
                    <Text>🌱 Agir pour la planète :
                        Trocle s’engage pour un avenir durable en favorisant la réutilisation des objets. Chaque échange réduit les déchets et soutient une économie circulaire. Grâce aux échanges locaux, vous contribuez également à limiter l’impact environnemental des transports.</Text>

                    <Text>🤝 Une communauté de confiance Avec Trocle, vous faites partie d’une communauté engagée et bienveillante. Les évaluations après chaque échange assurent un environnement sûr et respectueux. Vous avez également la possibilité de bloquer ou signaler des profils pour garantir votre tranquillité.</Text>

                    <Text>🎮 Le plaisir d’échanger :
                        Trocle transforme le troc en une expérience ludique et captivante. Likez des objets, matchez avec leurs propriétaires et découvrez de nouvelles opportunités d’échange. Tout cela dans une interface intuitive et moderne qui rend chaque interaction agréable.</Text>

                    <Text>
                        💰 Simplifiez vos échanges Avec les Trocoins, facilitez vos trocs en équilibrant les valeurs des objets échangés. Cette monnaie virtuelle pratique et accessible est votre alliée pour compléter les échanges de manière équitable, directement via l’application.
                    </Text>
                </Flex>
            </Flex>
        </CustomSafeAreaView>
    );
}
