
import { FlashList } from '@shopify/flash-list';
import { Stack, router, useRoute } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocationDetails } from '@/src/lib/hooks/useLocationDetails';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { getDateText } from '@/src/lib/utils/date';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import ImagePagination from '#/controls/ImagePagination';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio, { RATIO_PRESETS } from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import { CityPreviewMap } from '#/product/CityPreviewMap';

import { Certification, Controller, Heart, Location, Plusvert, Profile, Star0, Star05, Star1, State1, State2, State3, State4, Trocoin, Wallet } from '#/icons';





const avatarImage = require('@/assets/icon.png');

const connectedUser = 'xLeay'; // TODO : Remplacer par l'utilisateur connecté


type USER = {
    username: string,
    profilePicture: string,
    rating: number,
    reviewsAmount: number,
    memberSince: string,
    userCertified: boolean,
    certificationColor: 'brand' | 'accent',
    location: {
        latitude: number,
        longitude: number
    }
}

enum PRODUCT_STATE {
    brand_new = "Comme neuf",
    very_good = "Très bon état",
    good = "Bon état",
    bad = "Mauvais état",
}

enum CATEGORY {
    gaming = "Jeux-vidéos"
}

type PRODUCT = {
    id: string,
    photos: string[],
    title: string,
    brand: string,
    location: string,
    distance: number,
    creationDate: string,
    state: PRODUCT_STATE,
    category: CATEGORY,
    trocValue: number,
    description: string,
    user: USER
}

const MOCK_USER: USER = {
    username: 'Shuri',
    profilePicture: require('@/assets/icon.png'),
    rating: 4.5,
    reviewsAmount: 11,
    memberSince: '2024-11-16',
    userCertified: true,
    certificationColor: 'brand',
    location: {
        latitude: 48.9562018,
        longitude: 2.8884657
    }
}

const MOCK_PRODUCT: PRODUCT = {
    id: '1',
    photos: [
        'https://cdn.discordapp.com/attachments/922480277828304917/1541402824179716137/image.png?ex=6a8d76bf&is=6a8c253f&hm=e71c0e065d2efa054195e782e14754e6d1a659938f70c037dcc435fb0c09c25c&',
        'https://cdn.discordapp.com/attachments/922480277828304917/1541403121761390682/Snapchat-788934709.jpg?ex=6a8d7706&is=6a8c2586&hm=b472dfc9af0086454cef0629b32df4fdadb6cebb620151feabc8f4f2b6399b7a&'
    ],
    title: 'Nike Air Max 95 Essential',
    brand: 'Nike',
    location: 'Meaux',
    distance: 2.3,
    creationDate: '2026-08-22T17:03:00',
    state: PRODUCT_STATE.brand_new,
    category: CATEGORY.gaming,
    trocValue: 100,
    description: 'Je vends mes Nike Air Max 95 Essential, portées une seule fois',
    user: MOCK_USER
}


const getStarValue = (rating: number, index: number) => {
    const value = rating - index

    if (value >= 0.75) return 1
    if (value >= 0.25) return 0.5
    return 0
}

const getStateIcon = (state: PRODUCT_STATE) => {
    const size = 20

    switch (state) {
        case PRODUCT_STATE.brand_new:
            return <State1 size={size} />
        case PRODUCT_STATE.very_good:
            return <State2 size={size} />
        case PRODUCT_STATE.good:
            return <State3 size={size} />
        case PRODUCT_STATE.bad:
            return <State4 size={size} />
    }
}

const getCategoryIcon = (category: CATEGORY) => {
    const size = 20

    switch (category) {
        case CATEGORY.gaming:
            return <Controller size={size} />
    }
}


const USERNAME_SHOW_START_SCROLL = 24;
const USERNAME_SHOW_END_SCROLL = 56;
const USERNAME_START_OFFSET_Y = 24;

const PHOTOS_LIFT_PX = 100;
const PHOTOS_LIFT_END_SCROLL = 100;


export default function Product() {
    const { activeTheme } = useTheme();
    const insets = useSafeAreaInsets();

    const route = useRoute();
    const { id } = route.params as { id: string };

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const imageWidth = windowWidth;
    const imageHeight = imageWidth / RATIO_PRESETS['cover'];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    });

    const bannerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [0, imageHeight],
                    [0, -imageHeight + insets.top + 60],
                    Extrapolation.CLAMP,
                ),
            },
        ],
    }));

    const headerUsernameStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [USERNAME_SHOW_START_SCROLL, USERNAME_SHOW_END_SCROLL],
            [0, 1],
            Extrapolation.CLAMP,
        ),
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [USERNAME_SHOW_START_SCROLL, USERNAME_SHOW_END_SCROLL],
                    [USERNAME_START_OFFSET_Y, 0],
                    Extrapolation.CLAMP,
                ),
            },
        ],
    }));



    const { data: locationData, isLoading } = useLocationDetails(MOCK_PRODUCT.location);

    // locationData?.department -> "Seine-et-Marne"
    // locationData?.postalCode -> "77100"
    // locationData?.region     -> "Île-de-France"




    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        outlinedButtons: true,
        canGoBack,
        onBack,
        label: (
            <Animated.View pointerEvents={'none'} style={headerUsernameStyle}>
                <Text variant="title_Medium" type='invert' numberOfLines={1}>{MOCK_PRODUCT.title}</Text>
            </Animated.View>
        ),
        rightArea: [
            ...(connectedUser !== MOCK_USER.username ? [
                { iconName: Heart, onPress: () => alert("Liké"!), }
            ] : []),
            { iconName: Plusvert, onPress: () => alert("Plus !"), }
        ],
    });

    return (
        <CustomSafeAreaView
            style={{ backgroundColor: activeTheme.colors.surface.secondary }}
        >
            {/* <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}> */}
            <Stack.Screen
                options={{
                    statusBarStyle: 'inverted',
                }}
            />

            <TopAppBar
                backgroundTransparent
                left={left}
                center={center}
                right={right}

            // style={{ borderWidth: 2, borderColor: 'red' }}

            />

            {/* Photo article */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        height: imageHeight,
                        overflow: 'hidden',
                        backgroundColor: activeTheme.colors.surface.divider,
                    },
                    bannerStyle,
                ]}
            >
                <FlashList
                    data={MOCK_PRODUCT.photos}
                    horizontal

                    snapToInterval={imageWidth}
                    snapToAlignment='center'

                    decelerationRate={'normal'}
                    disableIntervalMomentum={true}

                    bounces={true}
                    overScrollMode='never'

                    keyExtractor={(uri, index) => `${MOCK_PRODUCT.id}-img-${index}`}
                    onViewableItemsChanged={viewableItemsChanged.current}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: imageUri }) => (
                        <Flex style={{ width: imageWidth, height: imageHeight }}>
                            <ImageRatio
                                transition={250}
                                ratio={'cover'}
                                source={{ uri: imageUri }}
                                style={{ width: imageWidth }}
                            />
                        </Flex>
                    )}
                />

                {/* Dots pagination */}
                <Flex
                    style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        bottom: activeTheme.spacing._200,
                        left: 0,
                        right: activeTheme.spacing._200,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}
                >
                    <ImagePagination
                        total={MOCK_PRODUCT.photos.length}
                        currentIndex={currentImageIndex}
                        type="text"
                    />
                </Flex>
            </Animated.View>

            {/* Informations article */}
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={{
                    paddingHorizontal: activeTheme.spacing._200,
                    flex: 1,
                    width: '100%',

                    // borderWidth: 2,
                    // borderColor: 'pink',
                }}
                bounces={false}
                contentContainerStyle={{
                    paddingTop: activeTheme.spacing._200 + (imageHeight - 60 - insets.top),
                    gap: activeTheme.spacing._400,
                }}
            >
                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    <Text variant='title_Large' type='primary' numberOfLines={2}>{MOCK_PRODUCT.title}</Text>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        <Text variant='body_Medium' type='primary'>{MOCK_PRODUCT.brand}</Text>
                    </Flex>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        {/* Localisation */}
                        <Flex direction='row' alignItems='center' justifyContent='flex-start' gap={activeTheme.spacing._50}>
                            <Location size={16} color={activeTheme.colors.icon.primary} />
                            <Text variant='body_Medium' type='primary'>{locationData?.department}</Text>
                        </Flex>

                        <Flex style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: activeTheme.colors.surface.contrast }} />

                        <Text variant='body_Medium' type='primary'>{MOCK_PRODUCT.distance.toString().replace('.', ',')} km</Text>
                    </Flex>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        <Text variant='body_Medium' type='primary'>{getDateText(MOCK_PRODUCT.creationDate)}</Text>
                    </Flex>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    <Text variant='title_Small' type='primary'>Détails sur l’article</Text>

                    {/* Détails */}
                    <Flex direction='column' gap={activeTheme.spacing._100} alignItems='flex-start' justifyContent='flex-start'>
                        {/* Détail */}
                        <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                            {/* Icône détail */}
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                                style={{
                                    height: 32,
                                    width: 32,
                                    borderRadius: 16,
                                    backgroundColor: activeTheme.colors.surface.brandLight,
                                }}>
                                {getStateIcon(MOCK_PRODUCT.state)}
                            </Flex>
                            <Text variant='body_Small' type='primary'>{MOCK_PRODUCT.state}</Text>
                        </Flex>

                        {/* Détail */}
                        <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                            {/* Icône détail */}
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                                style={{
                                    height: 32,
                                    width: 32,
                                    borderRadius: 16,
                                    backgroundColor: activeTheme.colors.surface.brandLight,
                                }}>
                                {getCategoryIcon(MOCK_PRODUCT.category)}
                            </Flex>
                            <Text variant='body_Small' type='primary'>{MOCK_PRODUCT.category}</Text>
                        </Flex>

                        {/* Détail */}
                        <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                            {/* Icône détail */}
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                                style={{
                                    height: 32,
                                    width: 32,
                                    borderRadius: 16,
                                    backgroundColor: activeTheme.colors.surface.brandLight,
                                }}>
                                <Wallet />
                            </Flex>
                            <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center' justifyContent='flex-start'>
                                <Text variant='body_Small' type='primary'>À partir de {MOCK_PRODUCT.trocValue} Trocoins</Text>
                                <Trocoin size={20} />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    <Text variant='title_Small' type='primary'>Description du produit</Text>
                    <Text variant='body_Medium' type='secondary'>{MOCK_PRODUCT.description}</Text>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    {/* Offreur */}
                    <Flex
                        border
                        borderColor={activeTheme.colors.border.primary}
                        fullWidth
                        gap={activeTheme.spacing._100}
                        style={{
                            padding: activeTheme.spacing._200,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary,
                        }}>
                        {/* Top */}
                        <Flex direction='row' fullWidth justifyContent='space-between' alignItems='center'>
                            <Avatar
                                size='veryLarge'
                                touchable={false}
                                customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${MOCK_PRODUCT.user.username}`}
                            />
                            <Flex direction='row' gap={activeTheme.spacing._50}>
                                <Button label='Suivre' variant='secondary' size='small' />
                                <Button variant='ghost' size='small' icon={<Plusvert />} />
                            </Flex>
                        </Flex>

                        {/* Nom utilisateur */}
                        <Flex gap={0}>
                            {/* Top */}
                            <Flex direction='row' gap={0}>
                                <Text variant='body_Large' type='primary'>{MOCK_PRODUCT.user.username}</Text>
                                {MOCK_PRODUCT.user.userCertified && (
                                    <Certification filled size={24} color={activeTheme.colors.icon[MOCK_PRODUCT.user.certificationColor] as keyof typeof activeTheme.colors.icon} />
                                )}
                            </Flex>

                            {/* Notes */}
                            <Flex direction='row' gap={activeTheme.spacing._50}>
                                {/* Notes numérique */}
                                <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                    <Text variant='body_Small' type='primary'>{MOCK_PRODUCT.user.rating.toString().replace('.', ',')}</Text>
                                    <Flex direction="row" gap={0}>
                                        {[0, 1, 2, 3, 4].map((index) => {
                                            const value = getStarValue(MOCK_USER.rating, index)
                                            if (value === 1) { return <Star1 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                            if (value === 0.5) { return <Star05 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                            return <Star0 key={index} size={16} color={activeTheme.colors.icon.yellow} />
                                        })}
                                    </Flex>
                                </Flex>
                                <Text variant='body_Small' type='primary'>({MOCK_PRODUCT.user.reviewsAmount})</Text>
                            </Flex>
                        </Flex>

                        {/* Création de compte */}
                        <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                            <Profile size={16} color={activeTheme.colors.icon.primary} />
                            <Text variant='body_Small' type='primary'>Membre depuis {getDateText(MOCK_USER.memberSince, 'monthYear')}</Text>
                        </Flex>
                    </Flex>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    {/* Localisation */}
                    <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                        <Location size={24} color={activeTheme.colors.icon.primary} />
                        <Text variant='title_Small' type='primary'>{MOCK_PRODUCT.location} ({locationData?.postalCode})</Text>
                    </Flex>

                    {/* Maps (Google) */}
                    <Flex fullWidth>
                        <CityPreviewMap
                            cityName={MOCK_PRODUCT.location}
                            ratio='3:2'
                        />
                    </Flex>
                </Flex>


                <Flex style={{ height: activeTheme.spacing._200 }} />
            </Animated.ScrollView>
            {/* </View> */}
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
        // backgroundColor: 'red'
    },
});
