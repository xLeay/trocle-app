export type CreateProductInput = {
    title: string;
    description: string;
    categoryId: number;
    stateId: number;
    attributes: Array<{
        attributeId: number;
        values: string[];
    }>;
    location: {
        city: string;
        postcode: string;
        department: string;
        latitude: number;
        longitude: number;
    };
};

export type ProfileProduct = {
    id: string;
    title: string;
    brand: string;
    images: string[];
    trocValue: number;
    isLiked?: boolean;
}

export type ProductDetails = {
    id: string;
    title: string;
    description: string;
    trocValue: number;
    createdAt: string;
    images: string[];
    brand: {
        id: number;
        name: string;
    } | null;
    state: {
        id: number;
        name: string;
        slug: string;
    } | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    owner: {
        username: string;
        avatarUrl: string | null;
        createdAt: string;
    };
};

export type ProductAttribute = {
    attributeId: number;
    values: string[];
};

export type ProductPublicLocation = {
    city: string;
    postcode: string;
    department: string;
    distanceMeters: number | null;
};