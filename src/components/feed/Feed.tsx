import React, { useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { useFeed, assembleFeed, FeedItem } from '@/src/queries/useFeed';
import { Product } from '@/src/types';

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

    const products: Product[] = data?.pages.flatMap(page => page.products) ?? [];
    const feedData = assembleFeed(products);

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
                        <SuggestedUsersBlock />
                    </Flex>
                );
            case 'suggested_user_products':
                return (
                    <Flex gap={activeTheme.spacing._200}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ marginLeft: activeTheme.spacing._200 }}>
                            <Text variant='title_Large'>Tu pourrais être intéressé</Text>
                        </Flex>
                        <SuggestedUserProductsBlock />
                    </Flex>
                );
            default:
                return null;
        }
    };

    if (isLoading) return <Text>Chargement…</Text>;
    if (error) return <Text>Erreur : {error.message}</Text>;
    return (
        <FlashList
            data={feedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
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
