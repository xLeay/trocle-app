import { ImageSourcePropType } from "react-native";

export interface User {
    id: string;
    username: string;
    profilePicture: ImageSourcePropType | string;
    reviewsAmount: number;
    rating: number;
    image: string;
}