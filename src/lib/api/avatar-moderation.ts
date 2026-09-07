import { supabase } from '@/src/lib/supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';

export type AvatarModerationResponse = {
    allowed: boolean;
    reason: 'nudity' | 'offensive_content' | 'weapon' | 'gore' | null;
};

export async function getAvatarModeration(uri: string): Promise<AvatarModerationResponse> {
    const imageResponse = await fetch(uri);
    const imageBlob = await imageResponse.blob();

    const jpegBlob = new Blob([imageBlob], {
        type: 'image/jpeg',
    });

    const formData = new FormData();
    formData.append('image', jpegBlob, 'avatar.jpg');


    const { data, error } = await supabase.functions.invoke(
        'moderate-profile-picture',
        { body: formData }
    );

    if (error) {

        if (error instanceof FunctionsHttpError) {
            console.error(
                'Réponse de la fonction :',
                await error.context.text()
            );
        }

        throw new Error('Impossible de vérifier la photo pour le moment.');
    }

    return data as AvatarModerationResponse;
};

export function getAvatarModerationMessage(reason: string | null): string {
    if (reason === 'nudity') {
        return 'Cette photo ne peut pas être utilisée comme photo de profil.';
    }

    return 'Cette photo ne respecte pas nos règles. Choisis-en une autre.';
};