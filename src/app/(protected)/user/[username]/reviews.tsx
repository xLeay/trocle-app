import { FlashList } from '@shopify/flash-list';
import { router, useRoute } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import SegmentedControls from '#/controls/SegmentedControls';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ProgressBar from '#/display/ProgressBar';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft, Star0, Star05, Star1 } from '#/icons';


const FILTER_OPTIONS: { label: string; value: string }[] = [
    { label: 'Tout', value: 'all' },
    { label: 'Membres', value: 'member' },
    { label: 'Automatique', value: 'automatic' },
];


type ReviewItem = {
    id: string;
    username: string;
    avatarUri?: string;
    location?: string;
    rating: number;
    comment: string;
    date: string;
    isMember: boolean;
    type: 'member' | 'automatic';
};

const MOCK_REVIEWS: ReviewItem[] = [
    {
        id: '1',
        username: 'florianparis75',
        location: 'Meaux',
        rating: 5,
        comment: 'Bien reçu, merci encore !',
        date: '2024-11-16',
        isMember: true,
        type: 'member'
    },
    {
        id: '2',
        username: 'MonsieurKeita',
        avatarUri: 'MonsieurKeita',
        location: 'Tremblay-en-France',
        rating: 5,
        comment: 'Je recommande tout à fait.',
        date: '2024-11-16',
        isMember: true,
        type: 'member'
    },
    {
        id: '3',
        username: 'Équipe Trocle',
        rating: 5,
        comment: 'Évaluation automatique : Échange réalisé avec succès',
        date: '2024-11-15',
        isMember: false,
        type: 'automatic'
    },
    {
        id: '4',
        username: 'adriano33400',
        avatarUri: 'adriano33400',
        location: 'Chauconin-Neufmontiers',
        rating: 4.5,
        comment: 'Très agréable et ponctuel.',
        date: '2024-11-15',
        isMember: true,
        type: 'member'
    },
    {
        id: '5',
        username: 'mimine22',
        avatarUri: 'mimine22',
        location: 'Mitry-Mory',
        rating: 5,
        comment: 'Parfait, rien à redire !',
        date: '2024-11-15',
        isMember: true,
        type: 'member'
    },
];

const TrocleBotAvatar = require('@/assets/logos/logo_trocle_whitebg.png');

const getStarValue = (rating: number, index: number) => {
    const value = rating - index

    if (value >= 0.75) return 1
    if (value >= 0.25) return 0.5
    return 0
}

function formatMonthYear(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
    }).format(date);
}


const HeaderComponent = ({
    activeTheme,
    username,
    avgRating,
    tabIndex,
    setTabIndex,
    totalRating
}: {
    activeTheme: any;
    username: string;
    avgRating: number;
    tabIndex: number;
    setTabIndex: (index: number) => void;
    totalRating: number;
}) => {
    return (
        <>
            {/* Note globale */}
            <Flex fullWidth gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._200, paddingTop: activeTheme.spacing._200 }}>
                {/* Top */}
                <Flex direction='row' fullWidth alignItems='center' justifyContent='space-between' style={{ marginBottom: activeTheme.spacing._100 }}>
                    {/* User */}
                    <Flex direction='row' gap={activeTheme.spacing._100} alignItems='center'>
                        <Avatar
                            size='veryLarge'
                        // customImage={''}
                        />
                        <Text variant='title_Large' type='primary'>{username}</Text>
                    </Flex>

                    {/* Note */}
                    <Flex gap={activeTheme.spacing._50} direction='row' alignItems='center'>
                        <Text variant='display_Large' type='primary'>{avgRating.toString().replace('.', ',')}</Text>
                        <Star1 size={48} color={activeTheme.colors.icon.yellow} />
                    </Flex>
                </Flex>

                <Divider />

                {/* Bottom */}
                <Flex fullWidth gap={0}>
                    {/* Score 5 */}
                    <Flex fullWidth direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._100 }}>
                        <Text variant='body_Medium' type='primary'>5</Text>
                        <ProgressBar progress={0.92} type='primary' innerColor={activeTheme.colors.surface.field} />
                    </Flex>
                    {/* Score 4 */}
                    <Flex fullWidth direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._100 }}>
                        <Text variant='body_Medium' type='primary'>4</Text>
                        <ProgressBar progress={0.1} type='primary' innerColor={activeTheme.colors.surface.field} />
                    </Flex>
                    {/* Score 3 */}
                    <Flex fullWidth direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._100 }}>
                        <Text variant='body_Medium' type='primary'>3</Text>
                        <ProgressBar progress={0.03} type='primary' innerColor={activeTheme.colors.surface.field} />
                    </Flex>
                    {/* Score 2 */}
                    <Flex fullWidth direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._100 }}>
                        <Text variant='body_Medium' type='primary'>2</Text>
                        <ProgressBar progress={0} type='primary' innerColor={activeTheme.colors.surface.field} />
                    </Flex>
                    {/* Score 1 */}
                    <Flex fullWidth direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._100 }}>
                        <Text variant='body_Medium' type='primary'>1</Text>
                        <ProgressBar progress={0} type='primary' innerColor={activeTheme.colors.surface.field} />
                    </Flex>
                </Flex>

                <Divider />
            </Flex>

            {/* Notes et reviews */}
            <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingVertical: activeTheme.spacing._200, flex: 1 }}>


                {/* Top */}
                <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                    <SegmentedControls
                        options={FILTER_OPTIONS.map(opt => opt.label)}
                        selectedIndex={tabIndex}
                        onChange={setTabIndex}
                    />
                    <Text variant='title_Medium' type='primary'>{totalRating.toString()} évaluation{totalRating > 1 ? 's' : ''}</Text>
                </Flex>
            </Flex>
        </>
    )
}


export default function Reviews() {

    const { activeTheme } = useTheme();


    const route = useRoute();
    const { username } = route.params as { username: string };


    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Évaluations',
    });


    const avgRating = 4.8;
    const [totalRating, setTotalRating] = useState(0);

    const [tabIndex, setTabIndex] = useState(0);
    const currentFilter = FILTER_OPTIONS[tabIndex].value;

    const filteredReviews = useMemo(() => {
        return MOCK_REVIEWS.filter((review) => {
            switch (currentFilter) {
                case 'member':
                    return review.type === 'member';
                case 'automatic':
                    return review.type === 'automatic';
                default:
                    return true;
            }
        });
    }, [currentFilter]);


    useEffect(() => {
        setTotalRating(filteredReviews.length);
    }, [filteredReviews]);

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                fullWidth
                left={left}
                center={center}
                right={right}
            />

            {/* Evaluations */}
            <Flex direction='column' gap={0} alignItems='center' justifyContent='flex-start' style={styles.container}>

                <FlashList
                    data={filteredReviews}
                    ListHeaderComponent={
                        <HeaderComponent activeTheme={activeTheme} username={username} avgRating={avgRating} setTabIndex={setTabIndex} tabIndex={tabIndex} totalRating={totalRating} />
                    }
                    ListFooterComponent={() => <Flex fullWidth style={{ height: activeTheme.spacing._400 }} />}
                    ItemSeparatorComponent={() => <Flex fullWidth style={{ paddingVertical: activeTheme.spacing._200 }}><Divider padding /></Flex>}
                    style={{ width: '100%' }}
                    renderItem={({ item, index }) => (
                        <Flex fullWidth direction='column' gap={activeTheme.spacing._50}>
                            <Table
                                isPressable={false}
                                leftProps={{
                                    variant: 'avatar',
                                    leftText: item.username,
                                    legendText: item.location,
                                    src: item.isMember && `https://api.dicebear.com/10.x/dylan/svg?seed=${item.username}` || TrocleBotAvatar,
                                    onAvatarPress: () => {
                                        router.push(`/user/${item.username}`);
                                    }
                                }}
                            />
                            {/* Infos */}
                            <Flex fullWidth direction='column' gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                                {/* Infos top */}
                                <Flex direction='row' gap={activeTheme.spacing._50} alignItems='center'>
                                    {/* Etoiles */}
                                    {[0, 1, 2, 3, 4].map((index) => {
                                        const value = getStarValue(item.rating, index)
                                        if (value === 1) { return <Star1 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                        if (value === 0.5) { return <Star05 key={index} size={16} color={activeTheme.colors.icon.yellow} /> }
                                        return <Star0 key={index} size={16} color={activeTheme.colors.icon.yellow} />
                                    })}

                                    <Flex style={{ height: 3, width: 3, borderRadius: 3, backgroundColor: activeTheme.colors.text.secondary }} />

                                    <Text variant='label_Small' type='secondary'>{formatMonthYear(item.date)}</Text>
                                </Flex>

                                <Text variant='body_Medium' type='primary'>{item.comment}</Text>
                            </Flex>
                        </Flex>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </Flex>


        </CustomSafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
    },
});
