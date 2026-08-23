import { FlashList } from '@shopify/flash-list';
import React, { useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { useScrollToTopOnTabPress } from '@/src/lib/hooks/useScrollToTopOnTabPress';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { useFeed } from '@/src/queries/useFeed';
import { assembleFeed } from '@/src/queries/useFeedAlgorithm';
import { DEFAULT_PATTERN, FeedItem } from '@/src/types/feed';

import AdSection from './AdSection';
import ProductBlock from './ProductBlock';
import SuggestedUserProductsBlock from './SuggestedUserProductsBlock';
import SuggestedUsersBlock from './SuggestedUsersBlock';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Checkbox from '#/controls/Checkbox';
import Chip from '#/controls/Chip';
import Radio from '#/controls/Radio';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';

import { Chevronbottom, Chevronright, Preferences } from '#/icons';

import { FILTERS } from '@/src/mock/filters.mock';



export default function Feed() {
    const { activeTheme } = useTheme();

    const listRef = useScrollToTopOnTabPress<any>();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useFeed();

    // Extraction des données nécessaires
    // const allProducts = data?.pages.flatMap(page => page.products) ?? [];
    // const allUsers = data?.pages.flatMap(page => page.users) ?? [];
    // const allUserProducts = data?.pages.flatMap(page => page.userProducts) ?? [];

    const feedData = React.useMemo(() => {
        if (!data) return [];

        return assembleFeed(
            data.pages.flatMap(p => p.products),
            data.pages.flatMap(p => p.users),
            data.pages.flatMap(p => p.userProducts),
            DEFAULT_PATTERN
        );
    }, [data]);


    const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>({});
    const toggleLike = (id: string) => {
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderItem = ({ item }: { item: FeedItem }) => {
        switch (item.type) {
            case 'product_group':
                return (
                    <Flex gap={activeTheme.spacing._200}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ marginLeft: activeTheme.spacing._200 }}>
                            <Text variant='title_Large'>Juste pour toi</Text>
                            <Chevronright />
                        </Flex>
                        {item.data.map(product => (
                            <ProductBlock
                                key={product.id}
                                item={product}
                                liked={!!likedPosts[product.id]}
                                onToggleLike={() => toggleLike(product.id)}
                            />
                        ))}
                    </Flex>
                );
            case 'ad':
                return (
                    <Flex gap={activeTheme.spacing._200}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ marginLeft: activeTheme.spacing._200 }}>
                            <Text variant='title_Large'>Publicité</Text>
                        </Flex>
                        <AdSection />
                    </Flex>
                );
            case 'suggested_users':
                return (
                    <Flex gap={activeTheme.spacing._200}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ marginLeft: activeTheme.spacing._200 }}>
                            <Text variant='title_Large'>Troclers à suivre</Text>
                        </Flex>
                        <SuggestedUsersBlock
                            users={item.data ?? []}
                        />
                    </Flex>
                );
            case 'suggested_user_products':
                return (
                    <Flex gap={activeTheme.spacing._200}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ marginLeft: activeTheme.spacing._200 }}>
                            <Text variant='title_Large'>Tu pourrais être intéressé</Text>
                        </Flex>
                        <SuggestedUserProductsBlock
                            user={item.data.user}
                            products={item.data.products ?? []}
                            liked={likedPosts}
                            onToggleLike={toggleLike}
                        />
                    </Flex>
                );
            default:
                return null;
        }
    };


    const filterSheetRef = useRef<BottomSheetRef>(null);
    type FilterKey = keyof typeof FILTERS;
    type FilterId = string | number;

    type FilterSection = {
        key: FilterKey;
        title: string;
        multiple: boolean;
        options: Array<{ id: FilterId; name: string; value?: string | number }>;
    };

    const FILTER_SECTIONS: FilterSection[] = [
        { key: 'sort', title: 'Trier par', multiple: false, options: FILTERS.sort },
        { key: 'categories', title: 'Catégories', multiple: false, options: FILTERS.categories },
        { key: 'conditions', title: 'État', multiple: false, options: FILTERS.conditions },
        { key: 'colors', title: 'Couleurs', multiple: true, options: FILTERS.colors },
        { key: 'sizes', title: 'Tailles', multiple: true, options: FILTERS.sizes },
    ];

    const EMPTY_FILTERS: Record<FilterKey, FilterId[]> = {
        sort: [],
        categories: [],
        conditions: [],
        colors: [],
        sizes: [],
    };

    const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, FilterId[]>>(EMPTY_FILTERS);
    const [filterPage, setFilterPage] = useState<FilterKey | null>(null);

    const currentSection = FILTER_SECTIONS.find(
        (section) => section.key === filterPage,
    );

    const selectedCount = Object.values(selectedFilters).flat().length;

    const toggleFilter = (
        key: FilterKey,
        id: FilterId,
        multiple: boolean,
    ) => {
        setSelectedFilters((previous) => {
            const values = previous[key];
            const alreadySelected = values.includes(id);

            return {
                ...previous,
                [key]: multiple
                    ? alreadySelected
                        ? values.filter((value) => value !== id)
                        : [...values, id]
                    : alreadySelected
                        ? []
                        : [id],
            };
        });
    };

    const openFilterPage = (key: FilterKey) => {
        setFilterPage(key);
        filterSheetRef.current?.present();
    };







    if (isLoading || !data) return (
        <Flex direction='row' fullWidth alignItems='center' justifyContent='center' gap={activeTheme.spacing._200}
            style={{
                paddingBlock: activeTheme.spacing._600
            }}
        >
            <Text variant='title_Medium' type='primary'>Chargement du feed</Text>
            <ActivityIndicator size="large" color={activeTheme.colors.icon.brand} />
        </Flex>
    );
    if (error) return <Text>Erreur : {error.message}</Text>;
    if (!feedData.length) return <Text>Aucun élément pour l'instant</Text>;

    return (
        <>
            <Flex
                // border
                // borderColor='red'
                scroll
                fullWidth
                direction='row'
                alignItems='center'
                justifyContent='flex-start'

                style={{
                    backgroundColor: activeTheme.colors.surface.secondary,
                    paddingBottom: activeTheme.spacing._100
                }}
                scrollProps={{
                    contentContainerStyle: {
                        gap: activeTheme.spacing._100,
                        paddingHorizontal: activeTheme.spacing._200,
                    },
                }}
            >
                <Chip
                    chipStyle="mono"
                    icon={<Preferences />}
                    selected={selectedCount > 0}
                    onPress={() => {
                        setFilterPage(null);
                        filterSheetRef.current?.present();
                    }}
                />
                {FILTER_SECTIONS
                    .filter((section) => selectedFilters[section.key].length > 0)
                    .map((section) => (
                        <Chip
                            key={section.key}
                            chipStyle="mono"
                            label={section.title}
                            selected
                            iconPosition="right"
                            icon={<Chevronbottom />}
                            onPress={() => openFilterPage(section.key)}
                        />
                    ))}
            </Flex>
            <FlashList
                ref={listRef}
                data={feedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    switch (item.type) {
                        case 'product_group':
                            return `product-${item.data?.[0]?.id ?? index}`;
                        case 'suggested_users':
                            return `users-${item.data?.[0]?.id ?? index}`;
                        case 'suggested_user_products':
                            return `user-products-${item.data?.user?.id ?? index}`;
                        default:
                            return item.id ?? `ad-${index}`;
                    }
                }}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={() => <Flex style={{ paddingTop: activeTheme.spacing._400 }} />}
                ItemSeparatorComponent={() => <Flex style={{ height: activeTheme.spacing._600 }} />}
                showsVerticalScrollIndicator={true}
                style={{ flex: 1 }}
            />

            <BottomSheet
                ref={filterSheetRef}
                headerVariant="text + icon"
                title={currentSection?.title ?? 'Filtres'}
                canGoBack={filterPage !== null}
                onBack={() => setFilterPage(null)}
                actions={
                    <>
                        <Button
                            label="Réinitialiser"
                            variant="outlined"
                            size="large"
                            fullWidth
                            disabled={!selectedCount}
                            onPress={() => {
                                setSelectedFilters(EMPTY_FILTERS)
                            }}
                        />

                        <Button
                            label="Appliquer"
                            variant="secondary"
                            size="large"
                            fullWidth
                            onPress={() => {
                                filterSheetRef.current?.dismiss();
                            }}
                        />
                    </>
                }
            >
                {currentSection ? (
                    currentSection.options.map((option) => {
                        const checked = selectedFilters[currentSection.key].includes(option.id);

                        return (
                            <Table
                                key={option.id}
                                leftProps={{
                                    leftText: option.name,
                                    variant: 'icon',
                                    icon: currentSection.key === 'colors' ? (
                                        <Flex
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 12,
                                                backgroundColor: option.value?.toString(),
                                                borderWidth: 1,
                                                borderColor: activeTheme.colors.border.primary,
                                            }}
                                        />
                                    ) : undefined,
                                }}
                                rightProps={{
                                    variant: currentSection.multiple ? 'checkbox' : 'radio',
                                    ...(currentSection.multiple
                                        ? {
                                            checkbox: (
                                                <Checkbox
                                                    checked={checked}
                                                    onValueChange={() =>
                                                        toggleFilter(
                                                            currentSection.key,
                                                            option.id,
                                                            currentSection.multiple,
                                                        )
                                                    }
                                                />
                                            ),
                                        }
                                        : {
                                            radio: (
                                                <Radio
                                                    checked={checked}
                                                    onValueChange={() =>
                                                        toggleFilter(
                                                            currentSection.key,
                                                            option.id,
                                                            currentSection.multiple,
                                                        )
                                                    }
                                                />
                                            ),
                                        }),
                                }}
                                onPress={() =>
                                    toggleFilter(
                                        currentSection.key,
                                        option.id,
                                        currentSection.multiple,
                                    )
                                }
                            />
                        );
                    })
                ) : (
                    FILTER_SECTIONS.map((section) => {
                        const selectedIds = selectedFilters[section.key] ?? [];
                        const count = selectedIds.length;

                        const selectedOption = section.options.find(
                            (option) => option.id === selectedIds[0],
                        );

                        return (
                            <Table
                                key={section.key}
                                leftProps={{ leftText: section.title }}
                                rightProps={{
                                    variant: 'text',
                                    rightText:
                                        count > 1
                                            ? `${count}`
                                            : selectedOption?.name ?? '',
                                    chevron: true,
                                }}
                                onPress={() => setFilterPage(section.key)}
                            />
                        )
                    })
                )}
            </BottomSheet>
        </>
    );
}
