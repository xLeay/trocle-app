import { router, Stack, useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { getDateText, getRelativeDateText, getTimeText } from '@/src/lib/utils/date';
import { formatLocationAddress, LocationAddress } from '@/src/lib/utils/geocoding';
import { getCategoryIcon, getStateIcon } from '@/src/lib/utils/product';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Flex from '#/Flex';
import Text from '#/Text';

import { CATEGORY, PRODUCT_STATE } from '@/src/lib/utils/product';

import { Arrowleft, Calendar, Handdelivery, Info, Location, Time } from '#/icons';


const myUsername = 'xLeay';

export interface TrocDetailsArticleItem {
    id: string;
    image: string;
    title: string;
    brand: string;
    state: PRODUCT_STATE;
    category: CATEGORY;
}

interface SummaryArticleProps {
    isMe?: boolean;
    myUsername?: string;
    targetUsername?: string;
    article: TrocDetailsArticleItem;
}

function SummaryArticle({
    isMe,
    myUsername,
    targetUsername,
    article,
}: SummaryArticleProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
            {/* Utilisateur */}
            <Flex direction="row" alignItems="center" gap={activeTheme.spacing._100}>
                <Avatar
                    size="large"
                    customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${isMe ? myUsername : targetUsername}`}
                />
                <Text variant="body_Large" type="primary">{isMe ? `${myUsername} (toi)` : targetUsername}</Text>
            </Flex>

            {/* Article */}
            <Flex
                fullWidth
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                gap={activeTheme.spacing._100}
            >
                {/* Image */}
                <Flex overflow="hidden" style={{ width: 160, borderRadius: activeTheme.radius.default }}>
                    <ImageRatio
                        ratio="cover"
                        source={article.image}
                    />
                </Flex>

                {/* Infos */}
                <Flex style={{ flex: 1 }} gap={activeTheme.spacing._100}>
                    {/* Top */}
                    <Flex direction="row" alignItems="center" justifyContent='center' gap={activeTheme.spacing._50}
                        style={{
                            paddingVertical: activeTheme.spacing._50,
                            paddingLeft: activeTheme.spacing._50,
                            paddingRight: activeTheme.spacing._100,
                            borderRadius: activeTheme.radius.default,
                            backgroundColor: activeTheme.colors.surface.blueLight,
                        }}
                    >
                        {getCategoryIcon(article.category, 16, activeTheme.colors.text.secondary)}
                        <Text variant="label_Medium" type="secondary">{article.category}</Text>
                    </Flex>

                    {/* Bottom */}
                    <Flex gap={activeTheme.spacing._100}>
                        {/* Nom + marque */}
                        <Flex>
                            <Text variant="title_Medium" type="primary">{article.title}</Text>
                            <Text variant="body_Medium" type="secondary">{article.brand}</Text>
                        </Flex>

                        {/* Etat */}
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                            <Text variant="body_Medium" type="secondary">
                                {article.state}
                            </Text>
                            {getStateIcon(article.state, 16, activeTheme.colors.text.secondary)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default function TrocDetails() {
    const { activeTheme } = useTheme();

    const insets = useSafeAreaInsets();

    const {
        id_troc,
        username,
        profile_picture,
        certified,
        certificationColor,
    } = useLocalSearchParams<{
        id_troc: string;
        username: string;
        profile_picture: string;
        certified: string;
        certificationColor: string;
    }>();




    // On choppe les données depuis la bdd

    //  myUsername,
    // targetUsername,
    // initiatorArticle,
    // receiverArticle,
    // deliveryMethod,
    // selectedAddress,
    // deliveryDate,
    // deliveryTime,
    // additionalInfos,
    // hasReadTheSummary,

    const initiatorArticle: TrocDetailsArticleItem = {
        id: 'mine-1',
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Xbox 360',
        brand: 'Microsoft',
        category: CATEGORY.gaming,
        state: PRODUCT_STATE.very_good,
    };

    const receiverArticle: TrocDetailsArticleItem = {
        id: 'receiver-1',
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Console Xbox 360',
        brand: 'Microsoft',
        category: CATEGORY.gaming,
        state: PRODUCT_STATE.very_good,
    };

    const selectedAddress: LocationAddress = {
        label: '123 Rue de la Paix 75001 Paris',
        name: '123 Rue de la Paix',
        city: 'Paris',
        postcode: '75001',
        department: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
    };

    // Proposition de troc : {"additionalInfos": "", "conversationId": "1", "deliveryDate": 2026-08-26T22:00:00.000Z, "deliveryMethod": "hand_delivery", "deliveryTime": 2026-08-27T13:45:00.000Z, "initiatorArticleId": "mine-1", "receiverArticleId": "receiver-1", "receiverUsername": "Shuri"}

    const deliveryDate = new Date('2026-08-26T22:00:00.000Z');
    const deliveryTime = new Date('2026-08-27T13:45:00.000Z');

    const deliveryDateTime = new Date(deliveryDate);

    deliveryDateTime.setHours(
        deliveryTime.getHours(),
        deliveryTime.getMinutes(),
        0,
        0,
    );

    const additionalInfos = '';
    const deliveryMethod = 'hand_delivery';
    const targetUsername = 'Shuri';

    const deliveryLabel =
        deliveryMethod === 'hand_delivery'
            ? 'En main propre'
            : 'En point relais';





    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };
    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Détails du Troc',
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

            <ScrollView style={styles.scrollView}>
                <Flex fullWidth gap={activeTheme.spacing._400}>
                    <Flex fullWidth gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                        <Text variant="title_Large" type="primary">Récapitulatif</Text>
                    </Flex>

                    <Flex fullWidth gap={activeTheme.spacing._200}>
                        <SummaryArticle
                            isMe
                            myUsername={myUsername}
                            article={initiatorArticle}
                        />

                        <Divider padding />

                        <SummaryArticle
                            targetUsername={targetUsername}
                            article={receiverArticle}
                        />
                    </Flex>

                    <Divider type='thick' />

                    <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                        <Text variant="title_Large" type="primary">Livraison</Text>

                        {/* Infos */}
                        <Flex fullWidth gap={activeTheme.spacing._100}>
                            {/* Type */}
                            <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                                <Handdelivery color={activeTheme.colors.icon.primary} size={24} />
                                <Text variant="body_Large" type="primary" numberOfLines={2} style={{ flexShrink: 1 }}>{deliveryLabel}</Text>
                            </Flex>

                            {/* Adresse */}
                            <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                                <Location color={activeTheme.colors.icon.primary} size={24} />
                                <Text variant="body_Large" type="primary" numberOfLines={2} style={{ flexShrink: 1 }}>{formatLocationAddress(selectedAddress)}</Text>
                            </Flex>

                            {/* Date */}
                            <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                                <Calendar color={activeTheme.colors.icon.primary} size={24} />
                                <Text
                                    variant="body_Large"
                                    type="primary"
                                    numberOfLines={2}
                                    style={{ flexShrink: 1 }}
                                >{getDateText(deliveryDate.toString(), 'date')} (<Text variant="body_Large" type="brand">{getRelativeDateText(deliveryDateTime.toString())}</Text>)
                                </Text>
                            </Flex>

                            {/* Heure */}
                            <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                                <Time color={activeTheme.colors.icon.primary} size={24} />
                                <Text
                                    variant="body_Large"
                                    type="primary"
                                    numberOfLines={2}
                                    style={{ flexShrink: 1 }}
                                >{getTimeText(deliveryTime.toString())}</Text>
                            </Flex>

                            {/* Autres infos */}
                            {additionalInfos && (
                                <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                                    <Info color={activeTheme.colors.icon.primary} size={24} />
                                    <Text variant="body_Large" type="secondary" numberOfLines={3} style={{ flexShrink: 1 }}>{additionalInfos}</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>

                    <Flex style={{ height: activeTheme.spacing._100 }} />
                </Flex>
            </ScrollView>

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