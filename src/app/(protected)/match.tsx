import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { getRandomIcebreaker } from '@/src/data/icebreakers';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import MessageBar from '#/bars/MessageBar';
import Button from '#/controls/Button';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

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
    const params = useLocalSearchParams();

    console.log(params)

    const recipientUsername = 'Shuri'


    const gradientColors: [string, string] = [
        activeTheme.colors.gradient.primaryGradient.colors[0],
        activeTheme.colors.gradient.primaryGradient.colors[1]
    ]

    const [message, setMessage] = useState('')

    const handleGenerateText = () => {
        const icebreaker = getRandomIcebreaker(recipientUsername);
        setMessage(icebreaker);
    }

    const handleOnSend = (message: string) => {
        console.log(message)
        // TODO: envoyer le message et rediriger vers la page de chat correspondante avec un router.replace
        setMessage('')
    }


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
                        productImage="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85"
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
                        productImage="https://images1.vinted.net/t/06_009c7_CK8akpyqmiiHQHBJVgisdniY/f800/1781207271.webp?s=5e7a319cd598d463327e6f4dc548a5e0c925c45b"
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
                            />
                        </Flex>
                        <MessageBar
                            variant="match"
                            placeholder='Envoie un message'
                            value={message}
                            onChangeText={setMessage}
                            onSend={handleOnSend}
                        />
                    </Flex>
                </KeyboardStickyView>
            </Flex>
        </CustomSafeAreaView>
    );
}
