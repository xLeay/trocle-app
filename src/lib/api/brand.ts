import { supabase } from '@/src/lib/supabase';

export type Brand = {
    id: number;
    name: string;
    slug: string;
    website?: string;
    picture?: string;
    isVerified: boolean;
};

export async function getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
        .from('brand')
        .select('id, name, slug, website, picture, is_verified')
        .eq('is_active', true)
        .order('is_verified', { ascending: false })
        .order('name');

    if (error) {
        throw error;
    }

    return data.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        website: brand.website,
        picture: brand.picture,
        isVerified: brand.is_verified ?? false,
    }));
}