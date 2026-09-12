// IMPORTS
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


// HOOKS
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';


// STORE
import { useAuthStore } from '@/src/state/authStore';


// QUERIES
import { useCategoryAttributes } from '@/src/queries/useCategoryQueries';
import { useProductAttributes, useProductById, useProductPublicLocation } from '@/src/queries/useProductQueries';
import { useUserProfileByUsername } from '@/src/queries/useUserQueries';



// UTILS
import { getDateText } from '@/src/lib/utils/date';
import { getCategoryIcon, getStateIcon } from '@/src/lib/utils/product';
import { getStarValue } from '@/src/lib/utils/rating';


// COMPONENTS
import Card from '#/Card';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import ImagePagination from '#/controls/ImagePagination';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio, { RATIO_PRESETS } from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// COMPOSANTS METIERS
import LoadingScreen from '#/display/LoadingScreen';
import NotFoundScreen from '#/display/NotFoundScreen';
import { CityPreviewMap } from '#/product/CityPreviewMap';


// ICÔNES
import { Heart, Location, Plusvert, Profile, Star0, Star05, Star1 } from '#/icons';



// const MOCK_USER: USER = {
//     username: 'Shuri',
//     profilePicture: require('@/assets/icon.png'),
//     rating: 4.5,
//     reviewsAmount: 11,
//     memberSince: '2024-11-16',
//     userCertified: true,
//     certificationColor: 'brand',
//     location: {
//         latitude: 48.9562018,
//         longitude: 2.8884657
//     }
// }


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




    const profile = useAuthStore((state) => state.profile)
    const connectedUser = profile?.username;

    const { data: product, isLoading, isError } = useProductById(id)

    const { data: productLocation } = useProductPublicLocation(id);

    const distanceKm = productLocation?.distanceMeters !== null &&
        productLocation?.distanceMeters !== undefined
        ? productLocation.distanceMeters / 1000
        : null;

    const { data: productAttributes = [] } = useProductAttributes(product?.id ?? '');

    const { data: categoryAttributes = [] } = useCategoryAttributes(product?.category?.id ?? null);

    const { data: ownerProfile } = useUserProfileByUsername(product?.owner.username ?? '');


    const rating = ownerProfile?.reviewsRating ?? 0;
    const reviewsAmount = ownerProfile?.reviewsCount ?? 0;



    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        outlinedButtons: true,
        canGoBack,
        onBack,
        label: (
            <Animated.View pointerEvents={'none'} style={headerUsernameStyle}>
                <Text variant="title_Medium" type='invert' numberOfLines={1}>{product?.title}</Text>
            </Animated.View>
        ),
        rightArea: [
            ...(connectedUser !== product?.owner.username ? [
                { iconName: Heart, onPress: () => alert("Liké"!), }
            ] : []),
            { iconName: Plusvert, onPress: () => alert("Plus !"), }
        ],
    });


    if (isLoading) {
        return <LoadingScreen message="Chargement du produit..." />;
    }

    if (isError || !product) {
        return (
            <NotFoundScreen
                title="Produit introuvable"
                description="Ce produit n'est plus disponible ou a été supprimé."
                actionLabel="Retour aux produits"
            />
        );
    }

    return (
        <CustomSafeAreaView
            style={{ backgroundColor: activeTheme.colors.surface.secondary }}
        >
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
                    data={product.images}
                    horizontal

                    snapToInterval={imageWidth}
                    snapToAlignment='center'

                    decelerationRate={'normal'}
                    disableIntervalMomentum={true}

                    bounces={true}
                    overScrollMode='never'

                    keyExtractor={(uri, index) => `${product.id}-img-${index}`}
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
                        total={product.images.length}
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
                    <Text variant='title_Large' type='primary' numberOfLines={2}>{product.title}</Text>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        {/* <Text variant='body_Medium' type='primary'>{product.brand}</Text> */}
                        <Text variant="body_Medium" type="primary">
                            {product.brand?.name ?? 'Sans marque'}
                        </Text>
                    </Flex>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        {/* Localisation */}
                        <Flex direction='row' alignItems='center' justifyContent='flex-start' gap={activeTheme.spacing._50}>
                            <Location size={16} color={activeTheme.colors.icon.primary} />
                            <Text variant='body_Medium' type='primary'>{productLocation?.department}</Text>
                        </Flex>

                        <Flex style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: activeTheme.colors.surface.contrast }} />

                        {distanceKm !== null && (
                            <Text variant='body_Medium' type='primary'>
                                {distanceKm.toFixed(1).replace('.', ',')} km
                            </Text>
                        )}
                    </Flex>

                    {/* Informations */}
                    <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                        <Text variant='body_Medium' type='primary'>{getDateText(product.createdAt)}</Text>
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
                                {getStateIcon(product.state?.slug)}
                            </Flex>
                            <Text variant='body_Small' type='primary'>{product.state?.name}</Text>
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
                                {getCategoryIcon(product.category?.slug)}
                                {/* TODO: Si c'est une catégorie enfant, on mets l'icone de la catégorie parente */}
                            </Flex>
                            <Text variant='body_Small' type='primary'>{product.category?.name}</Text>
                        </Flex>

                        {/* Détail */}
                        {/* Feature flag: Trocoins */}
                        {/* <Flex direction='row' fullWidth gap={activeTheme.spacing._100} alignItems='center' justifyContent='flex-start'>
                            Icône détail
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
                        </Flex> */}


                        {/* On map sur les attributs */}
                        {/* TODO: tester avec d'autres catégories qui require d'autres attributs */}
                        {productAttributes.map((productAttribute) => {
                            const definition = categoryAttributes.find(
                                (item) => item.id === productAttribute.attributeId
                            );

                            if (!definition) {
                                return null;
                            }

                            const valueText = productAttribute.values
                                .map(
                                    (value) =>
                                        definition.options.find((option) => option.value === value)?.name ??
                                        value
                                )
                                .join(', ');

                            return (
                                <Flex
                                    key={productAttribute.attributeId}
                                    direction="row"
                                    fullWidth
                                    gap={activeTheme.spacing._100}
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Text variant="body_Small" type="secondary">
                                        {definition.name}
                                    </Text>

                                    <Text variant="body_Small" type="primary">
                                        {valueText}{definition.unit ? ` ${definition.unit}` : ''}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    <Text variant='title_Small' type='primary'>Description du produit</Text>
                    <Text variant='body_Medium' type='secondary'>{product.description}</Text>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    {/* Offreur */}
                    <Card
                        border
                        borderColor={activeTheme.colors.border.primary}
                        gap={activeTheme.spacing._100}
                        padding={activeTheme.spacing._200}
                        width={'100%'}
                        touchable
                        onPress={() => router.push(`/user/${product.owner.username}`)}
                    >
                        {/* Top */}
                        <Flex direction='row' fullWidth justifyContent='space-between' alignItems='center'>
                            <Avatar
                                size='veryLarge'
                                touchable={false}
                                customImage={product.owner.avatarUrl}
                            />
                            <Flex direction='row' gap={activeTheme.spacing._50}>
                                {product.owner.username !== connectedUser && (
                                    <>
                                        <Button label='Suivre' variant='secondary' size='small' />
                                        <Button variant='ghost' size='small' icon={<Plusvert />} />
                                    </>
                                )}
                            </Flex>
                        </Flex>

                        {/* Nom utilisateur */}
                        <Flex gap={0}>
                            {/* Top */}
                            <Flex direction='row' gap={0}>
                                <Text variant='body_Large' type='primary'>{product.owner.username}</Text>
                                {/* {product.owner.isCertified && (
                                    <Certification filled size={24} color={activeTheme.colors.icon[product.owner.certificationColor] as keyof typeof activeTheme.colors.icon} />
                                )} */}
                                {/* TODO: Certif */}
                            </Flex>

                            {/* Notes */}
                            <Flex direction='row' gap={activeTheme.spacing._50}>
                                {/* Notes numérique */}
                                <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                    <Text variant='body_Small' type='primary'> {rating.toString().replace('.', ',')}</Text>
                                    <Flex direction="row" gap={0}>
                                        {[0, 1, 2, 3, 4].map((index) => {
                                            const value = getStarValue(rating, index)
                                            if (value === 1) { return <Star1 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                            if (value === 0.5) { return <Star05 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                            return <Star0 key={index} size={16} color={activeTheme.colors.icon.yellow} />
                                        })}
                                    </Flex>
                                </Flex>
                                <Text variant='body_Small' type='primary'>({reviewsAmount})</Text>
                            </Flex>
                        </Flex>

                        {/* Création de compte */}
                        <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                            <Profile size={16} color={activeTheme.colors.icon.primary} />
                            <Text variant='body_Small' type='primary'>Membre depuis {getDateText(product.owner.createdAt, 'monthYear').toLowerCase()}</Text>
                        </Flex>
                    </Card>
                </Flex>


                {/* --------- DIVIDER --------- */}
                <Divider />


                {/* --------- Section --------- */}
                <Flex direction='column' fullWidth gap={activeTheme.spacing._100}>
                    {/* Localisation */}
                    <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                        <Location size={24} color={activeTheme.colors.icon.primary} />
                        <Text variant='title_Small' type='primary'>{productLocation?.city} ({productLocation?.postcode})</Text>
                    </Flex>

                    {/* Maps (Google) */}
                    <Flex fullWidth>
                        <CityPreviewMap
                            cityName={productLocation?.city ?? ''}
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
