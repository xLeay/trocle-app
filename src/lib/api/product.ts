import * as ImagePicker from 'expo-image-picker';

import { supabase } from '@/src/lib/supabase';

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