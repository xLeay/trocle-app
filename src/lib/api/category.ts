import { supabase } from '@/src/lib/supabase';

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string;
    parentId: number | null;
};

export type CategoryAttributeOption = {
    id: string;
    name: string;
    value: string;
};

export type CategoryAttribute = {
    id: number;
    name: string;
    inputType: string;
    options: CategoryAttributeOption[];
    unit: string | null;
    required: boolean;
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

function normalizeAttributeOptions(options: unknown): CategoryAttributeOption[] {
    if (!Array.isArray(options)) {
        return [];
    }

    return options.flatMap((option) => {
        if (typeof option === 'string') {
            return [
                {
                    id: option,
                    name: option,
                    value: option,
                },
            ];
        }

        if (
            option &&
            typeof option === 'object' &&
            'value' in option
        ) {
            const item = option as {
                value: string;
                name?: string;
                label?: string;
            };

            return [
                {
                    id: item.value,
                    name: item.label ?? item.name ?? item.value,
                    value: item.value,
                },
            ];
        }

        return [];
    });
}

export async function getCategoryAttributes(categoryId: number): Promise<CategoryAttribute[]> {
    const { data, error } = await supabase
        .from('category_attributes_resolved')
        .select(`
            id_attribute_def,
            name,
            input_type,
            options,
            unit,
            required
        `)
        .eq('id_category', categoryId)
        .order('id_attribute_def');

    if (error) {
        throw error;
    }

    return data.map((attribute) => ({
        id: attribute.id_attribute_def,
        name: attribute.name,
        inputType: attribute.input_type,
        options: normalizeAttributeOptions(attribute.options),
        unit: attribute.unit,
        required: attribute.required,
    }));
}