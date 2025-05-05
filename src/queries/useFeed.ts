import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/src/lib/api/feed';
import { Product } from "@/src/types";

export type FeedItem =
    | { type: 'product_group'; data: Product[] }
    | { type: 'ad'; id: string }
    | { type: 'suggested_users'; id: string }
    | { type: 'suggested_user_products'; id: string };

// Types d'éléments non-produits
type NonProductFeedItemType = 'ad' | 'suggested_users' | 'suggested_user_products';

// Chaque élément du pattern
type InterleavePatternItem = number | NonProductFeedItemType;

const INTERLEAVE_PATTERN: InterleavePatternItem[] = [
    4, 'ad', 2, 'suggested_users', 'suggested_user_products'
];


export function useFeed() {
    return useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: async ({ pageParam }) => {
            const products = await getProducts(10, pageParam);
            return { products, nextOffset: pageParam + 10 };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset,
    });
}

export function assembleFeed(data: Product[]): FeedItem[] {
    const feed: FeedItem[] = [];
    let productIndex = 0;

    for (let i = 0; productIndex < data.length;) {
        for (const slot of INTERLEAVE_PATTERN) {
            if (typeof slot === 'number') {
                const group: Product[] = [];
                for (let j = 0; j < slot && productIndex < data.length; j++) {
                    group.push(data[productIndex++]);
                }
                if (group.length) {
                    feed.push({ type: 'product_group', data: group });
                }
                i += group.length;
            } else {
                feed.push({ type: slot, id: `${slot}-${i}` });
            }
        }
    }

    return feed;
}
