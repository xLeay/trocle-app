import {
    createHomeSwipe,
    getHomeDeckProducts,
    HomeDeckProduct,
    MatchResult,
} from '@/src/lib/api/homeDeck';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useHomeDeckProducts(userId: string | undefined) {
    return useQuery<HomeDeckProduct[]>({
        queryKey: ['home-deck-products', userId],
        queryFn: () => getHomeDeckProducts(userId!),
        enabled: Boolean(userId),
        staleTime: 1000 * 30,
    });
}

export function useHomeSwipe(userId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation<
        MatchResult | null,
        Error,
        {
            productId: string;
            swipeType: 'like' | 'pass';
        }
    >({
        mutationFn: ({ productId, swipeType }) =>
            createHomeSwipe(productId, swipeType),

        // onSuccess: () => {
        //     void queryClient.invalidateQueries({
        //         queryKey: ['home-deck-products', userId],
        //     });
        // },
    });
}