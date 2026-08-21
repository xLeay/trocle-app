import { Link, Stack, router, useRoute } from 'expo-router';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    useWindowDimensions
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedProps,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Grid from '#/Grid';
import Text from '#/Text';
import Button from '#/controls/Button';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio, { RATIO_PRESETS } from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Calendar, Chevronright, Heart, Location, Plus, Plusvert, Preferences, Share, Star0, Star05, Star1, Trocoin } from '#/icons';

const avatarImage = require('@/assets/icon.png');

const connectedUser = 'xLeay'; // TODO : Remplacer par l'utilisateur connecté

const MOCK_USER = {
    banner: require('@/assets/profile_banner.png'),
    avatar: avatarImage,
    username: 'xLeay',
    bio: 'Je troc de tout, assez souvent',
    location: 'Seine-et-Marne, France',
    joined: '2024-11-16',
    trocsCount: 11,
    followersCount: 12,
    followingCount: 18,
    reviewsCount: 11,
    reviewsRating: 4.5
}

const ARTICLES = [
    {
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Xbox 360',
        brand: 'Microsoft',
        trocValue: 5000,
        isLiked: true,
    },
    {
        image: 'https://m.media-amazon.com/images/I/914DXSZgJ7L._AC_UF1000,1000_QL80_.jpg',
        title: 'PS Vita',
        brand: 'Sony',
        trocValue: 8000,
        isLiked: false,
    },
    {
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Piano électrique petite taille',
        brand: 'Sans marque',
        trocValue: 7000,
        isLiked: true,
    },
]

const getStarValue = (rating: number, index: number) => {
    const value = rating - index

    if (value >= 0.75) return 1
    if (value >= 0.25) return 0.5
    return 0
}

const USERNAME_SHOW_START_SCROLL = 24;
const USERNAME_SHOW_END_SCROLL = 56;
const USERNAME_START_OFFSET_Y = 24;

const BLUR_MAX = 3
const BLUR_END_SCROLL = 24;

const BANNER_LIFT_PX = 24;
const BANNER_LIFT_END_SCROLL = 56;


export default function Profile() {
    const { activeTheme } = useTheme();
    const insets = useSafeAreaInsets();

    const route = useRoute();
    const { username } = route.params as { username: string };

    const bannerHeight = useWindowDimensions().width / RATIO_PRESETS['banner'];
    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });


    const animatedProps = useAnimatedProps(() => ({
        blurRadius: interpolate(
            scrollY.value,
            [0, BLUR_END_SCROLL],
            [0, BLUR_MAX],
            Extrapolation.CLAMP
        ),
    }));

    const bannerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [0, BANNER_LIFT_END_SCROLL],
                    [0, -BANNER_LIFT_PX],
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


    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        outlinedButtons: true,
        canGoBack,
        onBack,
        label: (
            <Animated.View pointerEvents={'none'} style={headerUsernameStyle}>
                <Text variant="title_Medium" type='invert'>{MOCK_USER.username}</Text>
            </Animated.View>
        ),
        rightArea: [
            { iconName: Share, onPress: () => alert("Partage !"), },
            ...(connectedUser !== username ? [
                { iconName: Plusvert, onPress: () => alert("Plus !"), }
            ] : []),
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

                onPress={() => {
                    router.push({
                        pathname: '/user/[username]/photo',
                        params: { username, kind: 'banner' },
                    })
                }}
            />

            {/* Bannière sticky */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        height: bannerHeight,
                        overflow: 'hidden',
                        backgroundColor: activeTheme.colors.surface.divider,
                    },
                    bannerStyle,
                ]}
            >
                <ImageRatio
                    ratio="banner"
                    source={MOCK_USER.banner}
                    animatedProps={animatedProps}
                    onPress={() => router.push({
                        pathname: '/user/[username]/photo',
                        params: { username, kind: 'banner' },
                    })}
                />
            </Animated.View>

            {/* Page de profil */}
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={{ padding: 0, gap: 0, width: '100%' }}
                bounces={false}
                contentContainerStyle={{ marginTop: BANNER_LIFT_PX }}
            >
                {/* Infos du profil */}
                <Flex fullWidth>
                    {/* Infos */}
                    <Flex gap={activeTheme.spacing._100} style={{ padding: activeTheme.spacing._200 }}>
                        {/* Top */}
                        <Flex fullWidth gap={activeTheme.spacing._100}>
                            {/* Avatar Boutons */}
                            <Flex direction='row' fullWidth justifyContent='space-between'>
                                <Avatar
                                    size='veryLarge'
                                    customImage={MOCK_USER.avatar}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/user/[username]/photo',
                                            params: { username, kind: 'avatar' },
                                        })
                                    }
                                />

                                {/* Boutons */}
                                <Flex direction='row' gap={activeTheme.spacing._100}>
                                    {username === connectedUser ? (
                                        <Button
                                            size='small'
                                            label='Modifier le profil'
                                            variant='tertiary'
                                            onPress={() => alert('Modifier le profil')}
                                        />
                                    ) : (
                                        <>
                                            <Button
                                                size='small'
                                                label='Suivre'
                                                variant='tertiary'
                                                onPress={() => alert('Suivre')}
                                            />
                                            <Button
                                                size='small'
                                                label='Contacter'
                                                variant='primary'
                                                onPress={() => alert('Contacter')}
                                            />
                                        </>
                                    )}
                                </Flex>
                            </Flex>

                            <Text variant='title_Large'>{username}</Text>
                        </Flex>

                        {/* Bio */}
                        <Text variant='body_Medium'>{MOCK_USER.bio}</Text>

                        {/* Données */}
                        <Flex gap={activeTheme.spacing._50}>
                            {/* Localisation */}
                            <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                                <Location size={16} color={activeTheme.colors.text.secondary} />
                                <Text variant='body_Medium' type='secondary'>{MOCK_USER.location}</Text>
                            </Flex>

                            {/* Création de compte */}
                            <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                                <Calendar size={16} color={activeTheme.colors.text.secondary} />
                                <Text variant='body_Medium' type='secondary'>Membre depuis {new Date(MOCK_USER.joined)
                                    .toLocaleDateString('fr-FR', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </Flex>
                        </Flex>

                        {/* Stats */}
                        <Flex direction='row' gap={activeTheme.spacing._100} alignItems='center' justifyContent='center'>
                            {[
                                { id: 'trocs', value: MOCK_USER.trocsCount, label: 'trocs' },
                                { id: 'followers', value: MOCK_USER.followersCount, label: 'abonnés' },
                                { id: 'following', value: MOCK_USER.followingCount, label: 'abonnements' },
                            ].map((stat, index, stats) => (
                                <React.Fragment key={stat.id}>
                                    <Link href={`/user/${username}/${stat.id}`}>
                                        <Flex direction="row" gap={activeTheme.spacing._50}>
                                            <Text variant="label_Large">{stat.value}</Text>
                                            <Text variant="body_Medium" type="secondary">{stat.label}</Text>
                                        </Flex>
                                    </Link>

                                    {index < stats.length - 1 && (
                                        <Flex
                                            style={{
                                                height: 3,
                                                width: 3,
                                                backgroundColor: activeTheme.colors.text.secondary,
                                                borderRadius: 2,
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Flex>
                    </Flex>

                    <Divider />

                    {/* Notes et Reviews */}
                    <Pressable
                        onPress={() => router.push(`/user/${username}/reviews`)}
                        style={({ pressed }) => ({
                            backgroundColor: pressed
                                ? activeTheme.colors.surface.divider
                                : 'transparent',
                            borderRadius: 8,
                        })}
                    >
                        <Flex direction='row' fullWidth justifyContent='space-between' alignItems='center' style={{ padding: activeTheme.spacing._100 }}>
                            {/* Gauche */}
                            <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                                {/* Notes */}
                                <Flex direction="row" gap={0}>
                                    {[0, 1, 2, 3, 4].map((index) => {
                                        const value = getStarValue(MOCK_USER.reviewsRating, index)
                                        if (value === 1) { return <Star1 key={index} size={32} color={activeTheme.colors.icon.yellow} /> }
                                        if (value === 0.5) { return <Star05 key={index} size={32} color={activeTheme.colors.icon.yellow} /> }
                                        return <Star0 key={index} size={32} color={activeTheme.colors.icon.yellow} />
                                    })}
                                </Flex>
                                <Text variant='body_Medium'>({MOCK_USER.reviewsCount} évaluations)</Text>
                            </Flex>

                            {/* Droite */}
                            <Chevronright />
                        </Flex>
                    </Pressable>

                    <Divider />

                </Flex>

                {/* Articles */}
                <Flex fullWidth gap={activeTheme.spacing._200} style={{
                    paddingTop: activeTheme.spacing._200,
                    paddingInline: activeTheme.spacing._200
                }}>

                    {/* Top */}
                    <Flex fullWidth direction='row' justifyContent='space-between' alignItems='center'>
                        <Text variant='title_Small'>3 articles</Text>
                        <Button variant='outlined' label='Trier' iconPosition='left' icon={<Preferences />} onPress={() => {
                            console.log('Trier')
                        }} />
                    </Flex>

                    {/* Grid des articles */}
                    <Grid columns={2} rows={2} gap={activeTheme.spacing._200} style={{}}>
                        {ARTICLES.map((article) => (
                            // Article
                            <Flex gap={activeTheme.spacing._50} key={article.title}>
                                {/* Image */}
                                <Flex fullWidth overflow='hidden' style={{ borderRadius: activeTheme.radius.default, position: 'relative' }}>
                                    <ImageRatio ratio='cover' source={article.image} />


                                    {username !== connectedUser ? (
                                        <Flex style={{ position: 'absolute', right: activeTheme.spacing._100, bottom: activeTheme.spacing._100, zIndex: 999 }}>
                                            <Button
                                                variant={article.isLiked ? 'gradient' : 'transparent'}
                                                size='small'
                                                icon={<Heart filled={article.isLiked} />}
                                                onPress={() => alert('J\'aime')}
                                            />
                                        </Flex>
                                    ) : null}
                                </Flex>

                                {/* Infos */}
                                <Flex gap={0}>
                                    <Text variant='label_Large'>{article.title}</Text>
                                    <Text variant='body_Small' type='secondary'>{article.brand}</Text>
                                    <Flex direction='row' gap={0} justifyContent='center'>
                                        <Text variant='body_Small' type='secondary'>Estimé à {article.trocValue}</Text>
                                        <Trocoin size={16} color={activeTheme.colors.text.secondary} />
                                    </Flex>
                                </Flex>
                            </Flex>
                        ))}

                        <Flex style={{ flex: 1, paddingBottom: activeTheme.spacing._1000 }} alignItems='center' justifyContent='center'>
                            <Button variant='outlined' label='Ajouter' size='large' icon={<Plus />} iconPosition='right' onPress={() => {
                                console.log('Ajouter');
                            }} />
                        </Flex>


                    </Grid>
                </Flex>

                <Flex style={{ height: activeTheme.spacing._600 }} />
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
