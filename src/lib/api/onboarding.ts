import { File } from 'expo-file-system';

import { supabase } from '@/src/lib/supabase';

export interface CompleteOnboardingInput {
    username: string;
    birthDate: Date | null;
    gender: 'male' | 'female' | 'other' | null;
    otherGender: string;
    selectedCategories: number[];
    avatarUri: string | null;
    latitude: number | null;
    longitude: number | null;
}

const formatDateForDatabase = (date: Date | null): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const uploadAvatar = async (
    userId: string,
    avatarUri: string
): Promise<string> => {
    const avatarFile = new File(avatarUri);
    const imageData = await avatarFile.arrayBuffer();

    const storagePath = `avatars/${userId}/avatar.jpg`;

    const { error } = await supabase.storage
        .from('user-images')
        .upload(storagePath, imageData, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
        });

    if (error) throw error;

    return storagePath;
};

export async function completeOnboarding(
    input: CompleteOnboardingInput
): Promise<void> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error(
            'Ta session a expiré. Reconnecte-toi pour continuer.'
        );
    }

    const profilePictureUrl = input.avatarUri
        ? await uploadAvatar(user.id, input.avatarUri)
        : null;

    const genderForDatabase =
        input.gender === 'other'
            ? input.otherGender.trim() || 'other'
            : input.gender;

    const { error } = await supabase.rpc('complete_onboarding', {
        p_username: input.username.trim(),
        p_birth_date: formatDateForDatabase(input.birthDate),
        p_gender: genderForDatabase,
        p_profile_picture: profilePictureUrl,
        p_latitude: input.latitude,
        p_longitude: input.longitude,
        p_category_ids: input.selectedCategories,
    });

    if (error) {
        throw error;
    }
}