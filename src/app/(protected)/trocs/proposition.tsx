import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useLocationStore } from '@/src/state/locationStore';

import Button from '#/controls/Button';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';

import PropositionArticle, { PropositionArticleItem } from '#/troc/PropositionArticle';
import PropositionDelivery, { PropositionDeliveryMethod } from '#/troc/PropositionDelivery';
import PropositionSummary from '#/troc/PropositionSummary';

import { Arrowleft } from '#/icons';


const STEPS = [
    'initiator_article',
    'receiver_article',
    'delivery',
    'summary',
] as const;

type PropositionStep = (typeof STEPS)[number];

const MY_ARTICLES: PropositionArticleItem[] = [
    {
        id: 'mine-1',
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Xbox 360',
        brand: 'Microsoft',
    },
    {
        id: 'mine-2',
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Piano électrique petite taille',
        brand: 'Sans marque',
    },
    {
        id: 'mine-3',
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Clavier maître',
        brand: 'Akai',
    },
];

const RECEIVER_ARTICLES: PropositionArticleItem[] = [
    {
        id: 'receiver-1',
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Console Xbox 360',
        brand: 'Microsoft',
    },
    {
        id: 'receiver-2',
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Piano électrique',
        brand: 'Yamaha',
    },
];

export default function TrocProposition() {
    const { activeTheme } = useTheme();

    const insets = useSafeAreaInsets();
    const offset = {
        closed: 0,
        opened: insets.bottom
    };


    const { clearTrocPropositionSelectedAddress } = useLocationStore();

    const {
        id,
        username = 'cet utilisateur',
    } = useLocalSearchParams<{
        id: string;
        username: string;
        profile_picture: string;
        certified: string;
        certificationColor: string;
    }>();

    const [stepIndex, setStepIndex] = useState(0);
    const [initiatorArticleId, setInitiatorArticleId] = useState<string | null>(null);
    const [receiverArticleId, setReceiverArticleId] = useState<string | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<PropositionDeliveryMethod | null>(null);
    const [additionalInfos, setAdditionalInfos] = useState('');
    const [loading, setLoading] = useState(false);

    const currentStep: PropositionStep = STEPS[stepIndex];

    const initiatorArticle = MY_ARTICLES.find((article) => article.id === initiatorArticleId) ?? null;

    const receiverArticle = RECEIVER_ARTICLES.find((article) => article.id === receiverArticleId) ?? null;

    const canContinue =
        (currentStep === 'initiator_article' &&
            initiatorArticle !== null) ||
        (currentStep === 'receiver_article' &&
            receiverArticle !== null) ||
        (currentStep === 'delivery' &&
            deliveryMethod !== null) ||
        currentStep === 'summary';

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex((current) => current - 1);
            return;
        }

        clearTrocPropositionSelectedAddress();

        if (router.canGoBack()) {
            router.back();
        }
    };

    const handleSubmit = async () => {
        if (
            !initiatorArticle ||
            !receiverArticle ||
            !deliveryMethod
        ) {
            return;
        }

        try {
            setLoading(true);

            const proposition = {
                conversationId: id,
                receiverUsername: username,
                initiatorArticleId: initiatorArticle.id,
                receiverArticleId: receiverArticle.id,
                deliveryMethod,
            };

            console.log('Proposition de troc :', proposition);

            // Remplace ce console.log par ton INSERT Supabase.
            // Puis fais un router.replace vers /trocs/[id_troc].
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!canContinue) {
            return;
        }

        if (currentStep === 'summary') {
            void handleSubmit();
            return;
        }

        setStepIndex((current) =>
            Math.min(current + 1, STEPS.length - 1),
        );
    };

    const getButtonLabel = () => {
        switch (currentStep) {
            case 'initiator_article':
                return 'Valider mon article';

            case 'receiver_article':
                return `Valider l’article de ${username}`;

            case 'delivery':
                return 'Valider le moyen d\'échange';

            case 'summary':
                return 'Faire une offre';
        }
    };




    useEffect(() => {
        // La page vient d'être ouverte :
        // on démarre une nouvelle proposition propre.
        clearTrocPropositionSelectedAddress();
    }, [clearTrocPropositionSelectedAddress]);

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack: stepIndex > 0 || router.canGoBack(),
        onBack: handleBack,
        label: 'Proposition de troc',
    });

    return (
        <CustomSafeAreaView
            style={{
                backgroundColor: activeTheme.colors.surface.secondary,
            }}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            <KeyboardStickyView
                offset={offset}
                style={{
                    flex: 1,
                    // borderWidth: 1,
                    // borderColor: 'blue'
                }}
            >
                <Flex fullWidth style={styles.container}>
                    <ScrollView
                        key={currentStep}
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.content,
                            {
                                paddingHorizontal: activeTheme.spacing._200,
                                paddingTop: activeTheme.spacing._100,
                                paddingBottom: insets.bottom + activeTheme.spacing._800,
                            },
                        ]}
                        showsVerticalScrollIndicator
                    >
                        {currentStep === 'initiator_article' && (
                            <PropositionArticle
                                owner="initiator"
                                username={username}
                                articles={MY_ARTICLES}
                                selectedArticleId={initiatorArticleId}
                                onSelectArticle={setInitiatorArticleId}
                                onAddArticle={() => {
                                    router.push('/modal/creation');
                                }}
                            />
                        )}

                        {currentStep === 'receiver_article' && (
                            <PropositionArticle
                                owner="receiver"
                                username={username}
                                articles={RECEIVER_ARTICLES}
                                selectedArticleId={receiverArticleId}
                                onSelectArticle={setReceiverArticleId}
                            />
                        )}

                        {currentStep === 'delivery' && (
                            <PropositionDelivery
                                value={deliveryMethod}
                                onChange={setDeliveryMethod}
                                additionalInfos={additionalInfos}
                                onChangeAdditionalInfos={setAdditionalInfos}
                            />
                        )}

                        {currentStep === 'summary' &&
                            initiatorArticle &&
                            receiverArticle &&
                            deliveryMethod && (
                                <PropositionSummary
                                    username={username}
                                    initiatorArticle={initiatorArticle}
                                    receiverArticle={receiverArticle}
                                    deliveryMethod={deliveryMethod}
                                />
                            )}
                    </ScrollView>
                </Flex>

                <Flex
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingVertical: activeTheme.spacing._200,
                        backgroundColor: activeTheme.colors.surface.secondary,
                        borderTopWidth: 1,
                        borderColor: activeTheme.colors.surface.divider,
                    }}
                >
                    <Button
                        label={getButtonLabel()}
                        variant="primary"
                        size="large"
                        fullWidth
                        disabled={!canContinue || loading}
                        loading={loading}
                        onPress={handleContinue}
                    />
                </Flex>
            </KeyboardStickyView>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
        width: '100%',
    },

    content: {
        width: '100%',
    },
});