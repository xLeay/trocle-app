import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// HOOKS
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

// DATA
import { getRandomIcebreaker } from '@/src/data/icebreakers';

// API
import { sendMatchMessage } from '@/src/lib/api/conversation';
import { getPublicStorageUrl } from '@/src/lib/api/helper';

// COMPOSANTS BASIQUES
import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import MessageBar from '#/bars/MessageBar';
import Button from '#/controls/Button';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// ICÔNES
import { Close, Subscription } from '#/icons';

interface MatchCardProps {
    productImage: string;
    style?: ViewStyle;
}

function MatchCard({
    productImage,
    style = {}
}: MatchCardProps) {

    const { activeTheme } = useTheme();

    return (
        <Flex
            fullWidth
            overflow='hidden'
            style={[
                {
                    width: 190,
                    borderRadius: activeTheme.radius.card,
                    borderWidth: 2,
                    borderColor: activeTheme.colors.surface.primary,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.25)',
                    elevation: 1
                },
                style,
            ]}
        >
            <ImageRatio
                source={productImage}
                ratio='2:3'
                touchable={false}
            />
        </Flex>
    )
}

export default function MatchModal() {
    const { activeTheme } = useTheme();

    const insets = useSafeAreaInsets();
    const offset = {
        closed: 0,
        opened: insets.bottom
    };

    const router = useRouter();
    const {
        matchedUserId,
        matchedUsername,
        myProductImage,
        theirProductImage,
    } = useLocalSearchParams<{
        matchedUserId?: string;
        matchedUsername?: string;
        myProductImage?: string;
        theirProductImage?: string;
    }>();

    const recipientUsername = matchedUsername ?? 'ce membre';


    const myProductImageUrl = useMemo(
        () => getPublicStorageUrl('product-images', myProductImage),
        [myProductImage]
    );

    const theirProductImageUrl = useMemo(
        () => getPublicStorageUrl('product-images', theirProductImage),
        [theirProductImage]
    );


    const gradientColors: [string, string] = [
        activeTheme.colors.gradient.primaryGradient.colors[0],
        activeTheme.colors.gradient.primaryGradient.colors[1]
    ]

    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false);

    const handleGenerateText = () => {
        const icebreaker = getRandomIcebreaker(recipientUsername);
        setMessage(icebreaker);
    }

    const handleOnSend = async (content: string) => {
        const trimmedContent = content.trim();

        if (!matchedUserId || !trimmedContent || isSending) {
            return;
        }

        try {
            setIsSending(true);

            const conversationId = await sendMatchMessage(
                matchedUserId,
                trimmedContent
            );

            setMessage('');

            router.replace(`/(protected)/chat/${conversationId}`);
        } catch (error) {
            console.error('Envoi du premier message impossible :', error);
        } finally {
            setIsSending(false);
        }
    };


    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Close,
        canGoBack,
        onBack,
    });

    return (

        <CustomSafeAreaView>
            <TopAppBar
                fullWidth
                backgroundTransparent
                left={left}
                center={center}
                right={right}
            />

            <LinearGradient
                colors={[gradientColors[0], gradientColors[1]]}
                style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            />


            <Flex
                fullWidth
                alignItems='center'
                justifyContent='space-between'
                style={{
                    flex: 1,
                    paddingHorizontal: activeTheme.spacing._200
                }}
            >

                <Text variant="display_Large" type='primary'>Tu as matché !</Text>

                {/* Cards */}
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    style={{
                        width: '100%',
                        height: 250, // Hauteur suffisante pour contenir le débordement des 2 cartes inclinées
                        position: 'relative',
                    }}
                >
                    <MatchCard
                        productImage={myProductImageUrl ?? ''}
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            transform: [
                                { translateX: -35 },
                                { translateY: -15 },
                                { rotate: '-9deg' },
                            ],
                        }}
                    />
                    <MatchCard
                        productImage={theirProductImageUrl ?? ''}
                        style={{
                            position: 'absolute',
                            zIndex: 2,
                            transform: [
                                { translateX: 35 },
                                { translateY: 25 },
                                { rotate: '9deg' },
                            ],
                        }}
                    />
                </Flex>

                {/* Text match */}
                <Flex alignItems="center">
                    <Text
                        variant="title_Small"
                        type="primary"
                        style={{ textAlign: 'center' }}
                    >
                        {`Tu as eu un match avec ${recipientUsername},\nenvoie-lui rapidement un message\npour réaliser un troc.`}
                    </Text>
                </Flex>

                <KeyboardStickyView
                    offset={offset}
                    style={{
                        width: '100%',
                        zIndex: 10
                    }}
                >
                    {/* Message */}
                    <Flex fullWidth alignItems='flex-end' gap={activeTheme.spacing._100}>
                        <Flex>
                            <Button
                                label='Tu sais pas quoi écrire ?'
                                variant='secondary'
                                size='small'
                                icon={<Subscription filled />}
                                iconPosition='right'
                                onPress={handleGenerateText}
                                disabled={isSending}
                            />
                        </Flex>
                        <MessageBar
                            variant="match"
                            placeholder='Envoie un message'
                            value={message}
                            onChangeText={setMessage}
                            onSend={handleOnSend}
                            isSending={isSending}
                        />
                    </Flex>
                </KeyboardStickyView>
            </Flex>
        </CustomSafeAreaView>
    );
}
