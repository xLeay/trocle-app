import React, { useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { useFeed } from '@/src/queries/useFeed';
import { assembleFeed } from '@/src/queries/useFeedAlgorithm'
import { Product, User, FeedItem, DEFAULT_PATTERN } from '@/src/types/feed';

import ProductBlock from './ProductBlock';
import AdSection from './AdSection';
import SuggestedUsersBlock from './SuggestedUsersBlock';
import SuggestedUserProductsBlock from './SuggestedUserProductsBlock';


import Text from '#/Text';
import Flex from '#/Flex';

import { Chevronright } from '#/icons';

export default function Feed() {

    const { activeTheme } = useTheme();
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

    if (isLoading || !data) return <Text>Chargement…</Text>;
    if (error) return <Text>Erreur : {error.message}</Text>;
    if (!feedData.length) return <Text>Aucun élément pour l'instant</Text>;
    return (
        <FlashList
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
            estimatedItemSize={400}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={() => <View style={{ height: activeTheme.spacing._600 }} />}
            showsVerticalScrollIndicator={false}
        />
    );
}
