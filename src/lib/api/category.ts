import { supabase } from '@/src/lib/supabase';

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string;
    parentId: number | null;
};

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('category')
        .select('id, name, slug, description, parent_id')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;

    return data.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parent_id,
    }));
}

export async function getBigCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('category')
        .select('id, name, slug, description, parent_id')
        .eq('is_active', true)
        .is('parent_id', null)
        .order('name');

    if (error) throw error;

    return data.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parent_id,
    }));
}
