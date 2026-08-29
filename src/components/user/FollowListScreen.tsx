import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Button from '#/controls/Button';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft } from '#/icons';
import { ActivityIndicator } from 'react-native';


export type FollowListItem = {
    id: string;
    username: string;
    avatarSeed: string;
    certified?: boolean;
    certificationColor?: string;
    followsYou?: boolean;
    isFollowedByYou?: boolean;
};

type FollowListScreenProps = {
    title: string;
    data: FollowListItem[];
    showFollowBackLabel?: boolean;
};

export default function FollowListScreen({
    title,
    data,
    showFollowBackLabel = false,
}: FollowListScreenProps) {
    const { activeTheme } = useTheme();

    const canGoBack = router.canGoBack();
    const onBack = () => {
        if (canGoBack) router.back();
    };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: title,
    });

    const getFollowButtonProps = (item: FollowListItem) => {
        if (item.isFollowedByYou) {
            return {
                label: 'Suivi',
                variant: 'outlined' as const,
            };
        }

        return {
            label:
                showFollowBackLabel && item.followsYou
                    ? 'Suivre en retour'
                    : 'Suivre',
            variant: 'secondary' as const,
        };
    };

    const Separator = () => (
        <Flex style={{ height: activeTheme.spacing._100 }} />
    );

    const [displayedData, setDisplayedData] = useState<FollowListItem[]>([]);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setDisplayedData(data);
        });

        return () => cancelAnimationFrame(id);
    }, [data]);


    return (
        <CustomSafeAreaView
            style={{ backgroundColor: activeTheme.colors.surface.secondary }}
        >
            <TopAppBar left={left} center={center} right={right} />

            <Flex
                fullWidth
                style={{ paddingTop: activeTheme.spacing._100, flex: 1 }}
            >
                {displayedData.length === 0 && (
                    <Flex fullWidth alignItems='center' justifyContent='center' style={{ flex: 1 }}>
                        <ActivityIndicator
                            color={activeTheme.colors.icon.brand}
                            size={64}
                        />
                    </Flex>
                )}
                {displayedData.length > 0 && (
                    <FlashList
                        data={displayedData}
                        keyExtractor={(item) => item.id}
                        style={{ width: '100%', flex: 1 }}

                        ItemSeparatorComponent={Separator}
                        ListFooterComponent={<Flex style={{ height: activeTheme.spacing._400 }} />}
                        renderItem={({ item }) => {
                            const followButton = getFollowButtonProps(item);

                            return (
                                <Table
                                    isPressable
                                    leftProps={{
                                        variant: 'avatar',
                                        avatarRecyclingKey: item.id,
                                        leftText: item.username,
                                        numberOfLines: 1,
                                        certified: item.certified,
                                        certificationColor:
                                            activeTheme.colors.icon[
                                            item.certificationColor as keyof typeof activeTheme.colors.icon
                                            ] ?? activeTheme.colors.icon.brand,
                                        src: `https://api.dicebear.com/10.x/dylan/svg?seed=${item.avatarSeed}`,
                                    }}
                                    rightProps={{
                                        variant: 'button',
                                        button: (
                                            <Button
                                                {...followButton}
                                                onPress={() => {
                                                    console.log('follow', item);
                                                }}
                                            />
                                        ),
                                    }}
                                />
                            );
                        }}

                    />
                )}
            </Flex>
        </CustomSafeAreaView>
    );
}
