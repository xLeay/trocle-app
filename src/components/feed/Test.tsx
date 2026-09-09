import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { useScrollToTopOnTabPress } from '@/src/lib/hooks/useScrollToTopOnTabPress';
import { useTheme } from '@/src/lib/hooks/useTheme';

import { useCategories } from '@/src/queries/useCategoryQueries';
import { useFeed, useFeedFilters } from '@/src/queries/useFeed';
import { assembleFeed } from '@/src/queries/useFeedAlgorithm';
import { useStates } from '@/src/queries/useStateQueries';

import { getCategoryIcon } from '@/src/lib/utils/product';

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


const COLOR_HEX: Record<string, string> = {
    Noir: '#000000',
    Blanc: '#FFFFFF',
    Gris: '#8b8b8bff',
    Beige: '#E8D5B7',
    Marron: '#724218ff',
    Rouge: '#b80c09ff',
    Orange: '#ff8c00ff',
    Jaune: '#ffda37ff',
    Vert: '#35b93cff',
    Bleu: '#248de9ff',
    Violet: '#9b1abeff',
    Rose: '#e730a1ff',
    Doré: '#d1ac32ff',
    Argenté: '#adadadff',
    Transparent: 'transparent',
    Multicolore: '#a94dffff',
    Autre: '#b3b3b3ff',
};

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
                                onPressProduct={() => router.push(`/product/${product.id}`)}
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





    const SORT_OPTIONS = [
        { id: 'relevance', name: 'Pertinence' },
        { id: 'recent', name: 'Les plus récents' },
        { id: 'price_asc', name: 'Prix le plus bas' },
        { id: 'price_desc', name: 'Prix le plus haut' },
    ] as const;

    const filterSheetRef = useRef<BottomSheetRef>(null);
    type FilterKey =
        | 'sort'
        | 'categories'
        | 'conditions'
        | `attribute:${string}`;

    type FilterId = string | number;

    type FilterSection = {
        key: FilterKey;
        title: string;
        multiple: boolean;
        options: ReadonlyArray<{
            id: FilterId;
            name: string;
            value?: string | number;
        }>;
    };

    const EMPTY_FILTERS: Record<FilterKey, FilterId[]> = {
        sort: [],
        categories: [],
        conditions: [],
    };


    const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, FilterId[]>>(EMPTY_FILTERS);
    const [tempSelectedFilters, setTempSelectedFilters] = useState<Record<FilterKey, FilterId[]>>(EMPTY_FILTERS);
    const [filterPage, setFilterPage] = useState<FilterKey | null>(null);


    const { data: categoriesData } = useCategories();
    const categories = categoriesData ?? [];

    const [categoryPath, setCategoryPath] = useState<number[]>([]);

    const categoryParentId =
        categoryPath[categoryPath.length - 1] ?? null;

    const hasChildren = (categoryId: number) =>
        categories.some((category) => category.parentId === categoryId);

    const visibleCategories = categories
        .filter((category) => category.parentId === categoryParentId)
        .sort((first, second) => {
            const firstIsLeaf = hasChildren(first.id) ? 0 : 1;
            const secondIsLeaf = hasChildren(second.id) ? 0 : 1;

            return (
                firstIsLeaf - secondIsLeaf ||
                first.name.localeCompare(second.name, 'fr')
            );
        });

    const currentCategory = categories.find(
        (category) => category.id === categoryParentId
    );

    const selectedCategoryId =
        typeof tempSelectedFilters.categories?.[0] === 'number'
            ? tempSelectedFilters.categories[0]
            : null;

    const selectedCategoryPath = React.useMemo(() => {
        if (!selectedCategoryId) {
            return [];
        }

        const path = [];
        let current = categories.find(
            (category) => category.id === selectedCategoryId
        );

        while (current) {
            path.unshift(current);

            current = categories.find(
                (category) => category.id === current?.parentId
            );
        }

        return path;
    }, [categories, selectedCategoryId]);

    const { data: statesData } = useStates();

    const { data: feedFilters } = useFeedFilters(selectedCategoryId);


    const FILTER_SECTIONS: FilterSection[] = [
        {
            key: 'sort',
            title: 'Trier par',
            multiple: false,
            options: SORT_OPTIONS,
        },
        {
            key: 'categories',
            title: 'Catégories',
            multiple: false,
            options: visibleCategories,
        },
        {
            key: 'conditions',
            title: 'État',
            multiple: true,
            options: statesData ?? [],
        },
        ...(feedFilters?.attributes ?? []).map((attribute) => ({
            key: `attribute:${attribute.key}` as const,
            title: attribute.name,
            multiple: attribute.multiple,
            options: attribute.options,
        })),
    ];





    const currentSection = FILTER_SECTIONS.find(
        (section) => section.key === filterPage,
    );

    const selectedCount = Object.values(selectedFilters).flat().length;

    const toggleFilter = (
        key: FilterKey,
        id: FilterId,
        multiple: boolean,
    ) => {
        setTempSelectedFilters((previous) => {
            const values = previous[key] ?? [];
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
        setTempSelectedFilters(selectedFilters);
        setFilterPage(key);
        filterSheetRef.current?.present();
    };

    const enterFilterPage = (key: FilterKey) => {
        if (key === 'categories') {
            setCategoryPath([]);
        }

        setFilterPage(key);
    };


    const handleNewFilters = () => {
        console.log('handleNewFilters', tempSelectedFilters);
        // TODO: On update le feed avec les nouveaux filtres et on scroll en haut
        setSelectedFilters(tempSelectedFilters)
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
        filterSheetRef.current?.dismiss();
    }





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
                    .filter((section) => selectedCount > 0)
                    .map((section) => (
                        <Chip
                            key={section.key}
                            chipStyle="mono"
                            label={section.title}
                            selected={(selectedFilters[section.key] ?? []).length > 0}
                            iconPosition="right"
                            icon={<Chevronbottom />}
                            onPress={() => openFilterPage(section.key)}
                        />
                    ))}
            </Flex>
            <FlashList
                refreshing={isFetchingNextPage}
                onRefresh={() => {
                    fetchNextPage();
                }}
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
                title={
                    currentSection?.key === 'categories' && currentCategory
                        ? currentCategory.name
                        : currentSection?.title ?? 'Filtres'
                }
                canGoBack={filterPage !== null}
                onBack={() => {
                    if (filterPage === 'categories' && categoryPath.length > 0) {
                        setCategoryPath((path) => path.slice(0, -1));
                        return;
                    }

                    setFilterPage(null);
                }}
                actions={
                    <Flex
                        direction='row'
                        gap={activeTheme.spacing._100}
                        fullWidth
                    >
                        <Button
                            label="Réinitialiser"
                            variant="outlined"
                            size="large"
                            fullWidth
                            disabled={!selectedCount}
                            onPress={() => {
                                setTempSelectedFilters(EMPTY_FILTERS)
                            }}
                        />

                        <Button
                            label="Appliquer"
                            variant="secondary"
                            size="large"
                            fullWidth
                            onPress={() => {
                                handleNewFilters();
                            }}
                        />
                    </Flex>
                }
            >
                {currentSection ? (
                    currentSection.options.map((option) => {
                        const isCategory = currentSection.key === 'categories';
                        const isColorAttribute = currentSection.key === 'attribute:color';

                        const category = isCategory
                            ? categories.find((item) => item.id === option.id)
                            : null;


                        const categoryHasChildren = Boolean(
                            category && hasChildren(category.id)
                        );

                        const selectedPathIndex = category
                            ? selectedCategoryPath.findIndex(
                                (selectedCategory) => selectedCategory.id === category.id
                            )
                            : -1;

                        const isSelectedBranch = selectedPathIndex >= 0;

                        const selectedDescendantText =
                            selectedPathIndex >= 0
                                ? selectedCategoryPath
                                    .slice(selectedPathIndex + 1)
                                    .map((selectedCategory) => selectedCategory.name)
                                    .join(' · ')
                                : '';

                        const checked =
                            (tempSelectedFilters[currentSection.key] ?? []).includes(option.id);

                        const isRootCategory = isCategory && category?.parentId === null;

                        const getSectionIcon = (optionValue?: string | number) => {
                            if (isColorAttribute) {

                                const color = typeof optionValue === 'string'
                                    ? COLOR_HEX[optionValue] ?? '#dddddddd'
                                    : '#dddddddd';

                                return (
                                    <Flex
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 12,
                                            backgroundColor: color,
                                            borderWidth: 1,
                                            borderColor: activeTheme.colors.border.primary,
                                        }}
                                    />
                                );
                            } else if (isRootCategory) {
                                return getCategoryIcon(category?.slug, 20);
                            }

                            return undefined;
                        };

                        return (
                            <Table
                                key={option.id}
                                leftProps={{
                                    leftText: option.name,
                                    variant: 'icon',
                                    icon: getSectionIcon(option.value)
                                }}
                                rightProps={
                                    categoryHasChildren
                                        ? {
                                            variant: 'text',
                                            rightText: selectedDescendantText,
                                            chevron: true,
                                            active: isSelectedBranch,
                                        }
                                        : {
                                            variant: currentSection.multiple
                                                ? 'checkbox'
                                                : 'radio',
                                            ...(currentSection.multiple
                                                ? {
                                                    checkbox: (
                                                        <Checkbox
                                                            checked={checked}
                                                            onValueChange={() =>
                                                                toggleFilter(
                                                                    currentSection.key,
                                                                    option.id,
                                                                    currentSection.multiple
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
                                                                    currentSection.multiple
                                                                )
                                                            }
                                                        />
                                                    ),
                                                }),
                                        }
                                }

                                onPress={() => {
                                    if (categoryHasChildren && category) {
                                        setCategoryPath((path) => [...path, category.id]);
                                        return;
                                    }

                                    toggleFilter(
                                        currentSection.key,
                                        option.id,
                                        currentSection.multiple
                                    );
                                }}
                            />
                        );
                    })
                ) : (
                    FILTER_SECTIONS.map((section) => {
                        const selectedIds = tempSelectedFilters[section.key] ?? [];
                        const count = selectedIds.length;

                        const selectedOption =
                            section.key === 'categories'
                                ? categories.find(
                                    (category) => category.id === selectedIds[0]
                                )
                                : section.options.find(
                                    (option) => option.id === selectedIds[0]
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
                                onPress={() => enterFilterPage(section.key)}
                            />
                        )
                    })
                )}
            </BottomSheet>
        </>
    );
}
