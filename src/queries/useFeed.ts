// import { useInfiniteQuery } from '@tanstack/react-query';
// import { getProducts, getUsers } from '@/src/lib/api/feed';
// import { Product, User } from "@/src/types";

// export interface FeedProductGroup {
//     type: 'product_group';
//     data: Product[];
// }
// export interface FeedSuggestedUsers {
//     type: 'suggested_users';
//     data: User[];
// }
// export interface FeedSuggestedUserProducts {
//     type: 'suggested_user_products';
//     data: {
//         user: User;
//         products: Product[];
//     };
// }
// export interface FeedAd {
//     type: 'ad';
//     id: string;
// }

// export type FeedItem =
//     | FeedProductGroup
//     | FeedSuggestedUsers
//     | FeedSuggestedUserProducts
//     | FeedAd;

// // Types d'éléments non-produits
// type NonProductFeedItemType = 'ad' | 'suggested_users' | 'suggested_user_products';

// // Chaque élément du pattern
// type InterleavePatternItem = number | NonProductFeedItemType;

// // const INTERLEAVE_PATTERN: InterleavePatternItem[] = [
// //     4, 'ad', 2, 'suggested_user_products', 'suggested_users'
// // ];
// const INTERLEAVE_PATTERN: InterleavePatternItem[] = [
//     'suggested_user_products', 'suggested_users'
// ];


// // export function useFeed() {
// //     return useInfiniteQuery({
// //         queryKey: ['feed'],
// //         queryFn: async ({ pageParam }) => {
// //             const data = await getProducts(10, pageParam);
// //             // Vérifiez que data.products existe bien
// //             if (!data.products) {
// //                 console.error('Structure de données inattendue :', data);
// //                 return { products: [], nextOffset: pageParam }; // Renvoyer un tableau vide en cas d'erreur
// //             }
// //             return { 
// //                 products: data.products, 
// //                 nextOffset: pageParam + 10 
// //             };
// //         },
// //         initialPageParam: 0,
// //         getNextPageParam: (lastPage) => lastPage.nextOffset,
// //     });
// // }

// export function useFeed() {
//     return useInfiniteQuery({
//         queryKey: ['feed'],
//         queryFn: async ({ pageParam = 0 }) => {
//             try {
//                 // Récupération des produits
//                 const productsResponse = await getProducts(10, pageParam);
//                 const products = productsResponse.products || [];

//                 // Récupération des utilisateurs
//                 const usersResponse = await getUsers(4, pageParam);
//                 const users = usersResponse.users || [];

//                 // Préparation des produits des utilisateurs
//                 const userProducts = users.map((user: User) => ({
//                     user,
//                     products: products.slice(0, 4)
//                 }));

//                 return {
//                     products,
//                     users,
//                     userProducts,
//                     nextOffset: pageParam + 10,
//                     hasNextPage: productsResponse.total > productsResponse.skip + productsResponse.limit
//                 };
//             } catch (error) {
//                 console.error('Erreur dans useFeed:', error);
//                 return {
//                     products: [],
//                     users: [],
//                     userProducts: [],
//                     nextOffset: pageParam + 10,
//                     hasNextPage: false
//                 };
//             }
//         },
//         initialPageParam: 0,
//         getNextPageParam: (lastPage) => {
//             if (!lastPage?.hasNextPage) return undefined;
//             return lastPage.nextOffset;
//         }
//     });
// }

// export function assembleFeed(
//     products: Product[],
//     suggestedUsers: User[],
//     suggestedUserProducts: { user: User, products: Product[] }[],
//     interleavePattern: InterleavePatternItem[] = INTERLEAVE_PATTERN
// ): FeedItem[] {
//     const feed: FeedItem[] = [];
//     let productIndex = 0;
//     let userIndex = 0;
//     let userProductIndex = 0;

//     let i = 0;
//     while (
//         productIndex < products.length ||
//         userIndex < suggestedUsers.length ||
//         userProductIndex < suggestedUserProducts.length
//     ) {
//         for (const slot of interleavePattern) {
//             if (typeof slot === 'number') {
//                 const group: Product[] = [];
//                 for (let j = 0; j < slot && productIndex < products.length; j++) {
//                     group.push(products[productIndex++]);
//                 }
//                 if (group.length) {
//                     feed.push({ type: 'product_group', data: group });
//                 }
//             } else if (slot === 'suggested_users') {
//                 if (userIndex < suggestedUsers.length) {
//                     // On prend 3 ou 4 users à chaque fois (adapte selon ton besoin)
//                     const users = suggestedUsers.slice(userIndex, userIndex + 4);
//                     feed.push({ type: 'suggested_users', data: users });
//                     userIndex += users.length;
//                 }
//             } else if (slot === 'suggested_user_products') {
//                 if (userProductIndex < suggestedUserProducts.length) {
//                     feed.push({ type: 'suggested_user_products', data: suggestedUserProducts[userProductIndex++] });
//                 }
//             } else if (slot === 'ad') {
//                 feed.push({ type: 'ad', id: `ad-${i}` });
//             }
//             i++;
//         }
//         // On sort si tout est consommé
//         if (
//             productIndex >= products.length &&
//             userIndex >= suggestedUsers.length &&
//             userProductIndex >= suggestedUserProducts.length
//         ) {
//             break;
//         }
//     }
//     return feed;
// }




import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts, getUsers } from '@/src/lib/api/feed';
import {
    Product, User, PageData,
    InterleavePatternItem, DEFAULT_PATTERN
} from '@/src/types/feed';
import { assembleFeed } from './useFeedAlgorithm';

const PRODUCTS_PER_PAGE = 8;
const USERS_PER_PAGE = 4;

async function fetchPage(pageIndex = 0): Promise<PageData> {
    const [prodRes, userRes] = await Promise.all([
        getProducts(PRODUCTS_PER_PAGE, pageIndex * PRODUCTS_PER_PAGE),
        getUsers(USERS_PER_PAGE, pageIndex * USERS_PER_PAGE),
    ]);

    return {
        products: prodRes?.products ?? [],
        users: userRes?.users ?? [],
        userProducts: userRes?.users.map((user: User) => ({
            user,
            products: (prodRes?.products ?? []).slice(0, 4)
        })) ?? []
    };
}

export function useFeed(pattern = DEFAULT_PATTERN) {
    return useInfiniteQuery({
        queryKey: ['feed', pattern],
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const page = await fetchPage(pageParam);
            return {
                ...page,
                feed: assembleFeed(page.products, page.users, page.userProducts, pattern),
                next: pageParam + 1,
                hasNext: page.products.length > 0 || page.users.length > 0,
            };
        },
        getNextPageParam: last => (last.hasNext ? last.next : undefined),
    });
}