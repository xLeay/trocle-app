import { ImageSourcePropType } from 'react-native';

export interface Product {
    id: string;
    title: string;
    images: string[];
}

export interface User {
    id: string;
    username: string;
    profilePicture: ImageSourcePropType | string;
    reviewsAmount: number;
    rating: number;
    image: string;
}

export type InterleavePatternItem = 
    | number 
    | 'suggested_users' 
    | 'suggested_user_products' 
    | 'ad';

export interface ProductGroupItem {
    type: 'product_group';
    data: Product[];
    id: string;
}

export interface SuggestedUsersItem {
    type: 'suggested_users';
    data: User[];
    id: string;
}

export interface SuggestedUserProductsItem {
    type: 'suggested_user_products';
    data: { user: User; products: Product[] };
    id: string;
}

export interface AdItem {
    type: 'ad';
    id: string;
}

export type FeedItem = 
    | ProductGroupItem 
    | SuggestedUsersItem 
    | SuggestedUserProductsItem 
    | AdItem;

export interface PageData {
    products: Product[];
    users: User[];
    userProducts: { user: User; products: Product[] }[];
}

export const DEFAULT_PATTERN: InterleavePatternItem[] = [
    4,
    'suggested_user_products',
    4,
    'ad',
    4,
    'suggested_users',
];
