import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft, Arrowright, Instagram, Openinnew, Plus, Remove, Thumbup, TikTok, TwitterX } from '#/icons';


const FAQ_ITEMS = [
    {
        id: '1',
        question: 'Comment échanger un objet avec un autre utilisateur ?',
        answer: 'Pour échanger un objet, rendez-vous sur la fiche du produit souhaité et cliquez sur "Proposer un échange". Sélectionnez ensuite l\'objet de votre inventaire que vous proposez en contrepartie.',
    },
    {
        id: '2',
        question: 'Que faire si je ne reçois pas l\'objet après un échange ?',
        answer: 'Pour échanger un objet, rendez-vous sur la fiche du produit souhaité et cliquez sur "Proposer un échange". Sélectionnez ensuite l\'objet de votre inventaire que vous proposez en contrepartie.',
    },
    {
        id: '3',
        question: 'C’est possible d’annuler un échange après l\'avoir confirmé ?',
        answer: 'Pour échanger un objet, rendez-vous sur la fiche du produit souhaité et cliquez sur "Proposer un échange". Sélectionnez ensuite l\'objet de votre inventaire que vous proposez en contrepartie.',
    },
    {
        id: '4',
        question: 'Comment signaler un utilisateur ou un objet inapproprié ?',
        answer: 'Pour échanger un objet, rendez-vous sur la fiche du produit souhaité et cliquez sur "Proposer un échange". Sélectionnez ensuite l\'objet de votre inventaire que vous proposez en contrepartie.',
    },
];

export default function HelpCenter() {

    const { activeTheme } = useTheme();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const toggleItem = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };





    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Centre d\'assistance',
    });

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                fullWidth
                left={left}
                center={center}
                right={right}
            />

            {/* Sections */}
            <Flex scroll fullWidth style={styles.container} gap={activeTheme.spacing._200}>
                {/* Donner son avis*/}
                <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, paddingBottom: activeTheme.spacing._100 }}>
                    <Text variant='title_Medium' type='primary'>Tu veux donner ton avis ?</Text>
                    <Table
                        leftProps={{
                            variant: 'icon',
                            leftText: "Faire un retour",
                            icon: <Thumbup />,
                        }}
                        rightProps={{
                            variant: 'icon',
                            icon: <Arrowright />,
                        }}
                        onPress={() => router.push('/support/feedback')}
                    />
                </Flex>

                {/* FAQ */}
                <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, paddingBottom: activeTheme.spacing._100 }}>
                    <Text variant='title_Medium' type='primary'>Foire aux questions</Text>
                    {/* Questions */}
                    <Animated.View
                        layout={LinearTransition.duration(250)}
                        style={{
                            width: '100%',
                            padding: activeTheme.spacing._200,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary,
                            borderWidth: 1,
                            borderColor: activeTheme.colors.border.primary,
                            gap: activeTheme.spacing._100,
                        }}
                    >
                        {FAQ_ITEMS.map((item) => {
                            const isExpanded = expandedId === item.id;
                            return (
                                <Animated.View
                                    key={item.id}
                                    layout={LinearTransition.duration(250)}
                                    style={{ width: '100%' }}
                                >
                                    <Pressable
                                        onPress={() => toggleItem(item.id)}
                                        style={{ width: '100%' }}
                                    >
                                        <Animated.View
                                            layout={LinearTransition.duration(250)}
                                            style={{
                                                width: '100%',
                                                padding: activeTheme.spacing._100,
                                                borderRadius: activeTheme.radius.card,
                                                backgroundColor: activeTheme.colors.surface.secondary,
                                                borderWidth: 1,
                                                borderColor: activeTheme.colors.border.primary,
                                                gap: activeTheme.spacing._100,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Ligne En-tête (Question + Bouton) */}
                                            <Flex
                                                direction='row'
                                                alignItems='center'
                                                fullWidth
                                                gap={activeTheme.spacing._100}
                                                style={{ minHeight: 40 }}
                                            >
                                                <Flex style={{ flex: 1 }}>
                                                    <Text variant='body_Small' type='primary'>
                                                        {item.question}
                                                    </Text>
                                                </Flex>
                                                <Button
                                                    icon={isExpanded ? <Remove /> : <Plus />}
                                                    size='small'
                                                    variant='ghost'
                                                    onPress={() => toggleItem(item.id)}
                                                />
                                            </Flex>
                                            {/* Réponse affichée si ouverte */}
                                            {isExpanded && (
                                                <Animated.View
                                                    entering={FadeIn.duration(200)}
                                                    exiting={FadeOut.duration(150)}
                                                    style={{
                                                        width: '100%',
                                                        paddingTop: activeTheme.spacing._100,
                                                        borderTopWidth: 1,
                                                        borderTopColor: activeTheme.colors.border.primary,
                                                    }}
                                                >
                                                    <Text variant='body_Small' type='secondary'>
                                                        {item.answer}
                                                    </Text>
                                                </Animated.View>
                                            )}
                                        </Animated.View>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                        <Animated.View layout={LinearTransition.duration(250)}>
                            <Flex
                                fullWidth
                                direction='row'
                                alignItems='center'
                                justifyContent='center'
                                style={{ marginTop: activeTheme.spacing._200 }}
                            >
                                {/* TODO : Rediriger vers les questions */}
                                <Button label='Tout voir' size='small' variant='tertiary' fullWidth />
                            </Flex>
                        </Animated.View>
                    </Animated.View>
                </Flex>

                {/* Aide */}
                <Animated.View layout={LinearTransition.duration(250)} style={{ width: '100%' }}>
                    <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, paddingBottom: activeTheme.spacing._100 }}>
                        <Text variant='title_Medium' type='primary'>Besoin d'aide ?</Text>

                        {/* Content */}
                        <Flex
                            fullWidth
                            border
                            borderColor={activeTheme.colors.border.primary}
                            style={{
                                borderRadius: activeTheme.radius.card,
                                backgroundColor: activeTheme.colors.surface.primary,
                            }}
                        >
                            <Text variant='body_Medium' type='primary' containerStyle={{ padding: activeTheme.spacing._200, marginBottom: activeTheme.spacing._200 }}>Envoies nous un message sur nos réseaux sociaux ou consulte notre FAQ pour trouver des solutions.</Text>

                            {/* SNS */}
                            <Flex fullWidth gap={activeTheme.spacing._50}>

                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'X (anciennement Twitter)',
                                        leftTextVariant: 'body_Medium',
                                        icon: <TwitterX size={24} />,
                                        keepIconColor: true
                                    }}
                                    rightProps={{
                                        variant: 'icon',
                                        icon: <Openinnew size={24} color={activeTheme.colors.icon.primary} />
                                    }}
                                    onPress={() => Linking.openURL('https://x.com/TrocleApp')}
                                />

                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'Instagram',
                                        leftTextVariant: 'body_Medium',
                                        icon: <Instagram size={24} />,
                                        keepIconColor: true
                                    }}
                                    rightProps={{
                                        variant: 'icon',
                                        icon: <Openinnew size={24} color={activeTheme.colors.icon.primary} />
                                    }}
                                    onPress={() => Linking.openURL('https://instagram.com/trocleapp')}
                                />

                                <Table
                                    leftProps={{
                                        variant: 'icon',
                                        leftText: 'TikTok',
                                        leftTextVariant: 'body_Medium',
                                        icon: <TikTok size={24} />,
                                        keepIconColor: true
                                    }}
                                    rightProps={{
                                        variant: 'icon',
                                        icon: <Openinnew size={24} color={activeTheme.colors.icon.primary} />
                                    }}
                                    // TODO : Ajouter le vrai lien
                                    onPress={() => Linking.openURL('')}
                                />
                            </Flex>
                        </Flex>
                    </Flex>
                </Animated.View>
            </Flex>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});