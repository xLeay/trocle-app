import * as ImagePicker from 'expo-image-picker';

import { supabase } from '@/src/lib/supabase';

import {
    CreateProductInput,
    ProductAttribute,
    ProductDetails,
    ProductPublicLocation,
    ProfileProduct
} from '@/src/types/product';


export async function createProduct(
    input: CreateProductInput,
    photos: ImagePicker.ImagePickerAsset[]
): Promise<string> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
        throw new Error('Session Supabase introuvable.');
    }

    const supabaseUrl =
        process.env.EXPO_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Configuration Supabase manquante.'
        );
    }

    const formData = new FormData();

    formData.append(
        'payload',
        JSON.stringify(input)
    );

    for (const [index, photo] of photos.entries()) {
        const imageResponse = await fetch(photo.uri);

        if (!imageResponse.ok) {
            throw new Error(
                `Impossible de lire la photo ${index + 1}.`
            );
        }

        const originalBlob = await imageResponse.blob();

        const jpegBlob = new Blob(
            [originalBlob],
            {
                type: 'image/jpeg',
            }
        );

        formData.append(
            'images',
            jpegBlob,
            `${index + 1}.jpg`
        );
    }

    const response = await fetch(
        `${supabaseUrl}/functions/v1/create-product`,
        {
            method: 'POST',
            headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
        }
    );

    const responseText = await response.text();

    let responseData: {
        productId?: string;
        error?: string;
    };

    try {
        responseData = JSON.parse(responseText);
    } catch {
        throw new Error(
            `Réponse serveur invalide (${response.status}).`
        );
    }

    if (!response.ok) {
        throw new Error(
            responseData.error ??
            `Erreur serveur (${response.status}).`
        );
    }

    if (!responseData.productId) {
        throw new Error(
            'La création du produit a échoué.'
        );
    }

    return String(responseData.productId);
}


export async function getProductsByUsername(
    username: string
): Promise<ProfileProduct[]> {
    const { data, error } = await supabase
        .from('product')
        .select(`
            id,
            name,
            price_trocoin,
            brand (
                name
            ),
            owner:user!product_id_user_fkey!inner (
                username
            ),
            photos:product_photos!product_photos_id_product_fkey (
                url,
                order_position
            )
        `)
        .eq('owner.username', username)
        .eq('is_active', true);

    if (error) {
        throw error;
    }

    return (data ?? []).map((product) => ({
        id: String(product.id),
        title: product.name,
        brand: (
            Array.isArray(product.brand)
                ? product.brand[0]
                : product.brand
        )?.name ?? 'Sans marque',
        trocValue: product.price_trocoin,
        images: (product.photos ?? [])
            .sort((a, b) => a.order_position - b.order_position)
            .map((photo) => {
                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(photo.url);

                return data.publicUrl;
            }),
    }));
}


const getProductImageUrl = (pathOrUrl: string): string => {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }

    return supabase.storage
        .from('product-images')
        .getPublicUrl(pathOrUrl)
        .data.publicUrl;
}

const getUserImageUrl = (pathOrUrl: string | null): string | null => {
    if (!pathOrUrl) return null;

    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }

    return supabase.storage
        .from('user-images')
        .getPublicUrl(pathOrUrl)
        .data.publicUrl;
};

export async function getProductById(
    productId: string
): Promise<ProductDetails | null> {
    const { data, error } = await supabase
        .from('product')
        .select(`
            id,
            name,
            description,
            price_trocoin,
            created_at,

            brand:brand!product_id_brand_fkey (
                id,
                name
            ),

            state:state!product_id_state_fkey (
                id,
                name,
                slug
            ),

            category:category!product_id_category_fkey (
                id,
                name,
                slug
            ),

            owner:user!product_id_user_fkey (
                id,
                username,
                profile_picture,
                created_at
            ),

            photos:product_photos!product_photos_id_product_fkey (
                url,
                order_position
            )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const brand = Array.isArray(data.brand)
        ? data.brand[0] ?? null
        : data.brand;

    const state = Array.isArray(data.state)
        ? data.state[0] ?? null
        : data.state;

    const category = Array.isArray(data.category)
        ? data.category[0] ?? null
        : data.category;

    const owner = Array.isArray(data.owner)
        ? data.owner[0] ?? null
        : data.owner;

    if (!owner) {
        throw new Error('Produit incomplet : propriétaire introuvable.');
    }

    return {
        id: String(data.id),
        title: data.name,
        description: data.description ?? '',
        trocValue: data.price_trocoin,
        createdAt: data.created_at,
        brand: brand
            ? {
                id: brand.id,
                name: brand.name,
            }
            : null,
        state: state
            ? { id: state.id, name: state.name, slug: state.slug }
            : null,
        category: category
            ? { id: category.id, name: category.name, slug: category.slug }
            : null,
        owner: {
            username: owner.username,
            avatarUrl: getUserImageUrl(owner.profile_picture),
            createdAt: owner.created_at,
        },
        images: (data.photos ?? [])
            .sort((a, b) => a.order_position - b.order_position)
            .map((photo) => getProductImageUrl(photo.url)),
    };
}


export async function getProductAttributes(
    productId: string
): Promise<ProductAttribute[]> {
    const { data, error } = await supabase
        .from('product_attributes')
        .select('id_attribute_def, product_attribute_value')
        .eq('id_product', productId);

    if (error) {
        throw error;
    }

    const attributesById = new Map<number, string[]>();

    for (const row of data ?? []) {
        const currentValues =
            attributesById.get(row.id_attribute_def) ?? [];

        attributesById.set(
            row.id_attribute_def,
            [...currentValues, row.product_attribute_value]
        );
    }

    return [...attributesById.entries()].map(
        ([attributeId, values]) => ({
            attributeId,
            values,
        })
    );
}

export async function getProductPublicLocation(
    productId: string
): Promise<ProductPublicLocation | null> {
    const { data, error } = await supabase.rpc(
        'get_product_locations_public',
        {
            p_product_ids: [Number(productId)],
            p_limit: 1,
            p_offset: 0,
        }
    );

    if (error) {
        throw error;
    }

    const location = data?.[0];

    if (!location) {
        return null;
    }

    return {
        city: location.city,
        postcode: location.postcode,
        department: location.department,
        distanceMeters: location.distance_meters,
    };
}