import { ImageSourcePropType } from "react-native";

export interface User {
    id: string;
    created_at: string;
    username: string;
    bio?: string;
    birth_date?: string;
    gender?: string;
    profile_picture?: ImageSourcePropType | string;
    profile_header?: ImageSourcePropType | string;
    id_location?: number;
    phone_number?: string;
    trocoin_balance: number;
    email?: string;
}

export type UserProfile = {
    id: string;
    username: string;
    avatarUrl: ImageSourcePropType | string | undefined;
    bannerUrl: ImageSourcePropType | string | undefined;
    bio: string | null;
    location: string | null;
    createdAt: string;
    trocsCount: number;
    followersCount: number;
    followingCount: number;
    reviewsCount: number;
    reviewsRating: number | null;
}