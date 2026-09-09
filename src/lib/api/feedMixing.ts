import { supabase } from '@/src/lib/supabase';

const BASE_URL = 'https://dummyjson.com';

export async function getProducts(limit: number = 10, skip: number = 0) {
    try {
        const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Erreur lors du chargement des produits');
        const data = await response.json();
        return {
            products: data.products || [],
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || 0
        };
    } catch (error) {
        console.error('Erreur API produits:', error);
        return { products: [], total: 0, skip: 0, limit: 0 };
    }
}

export async function getUsers(limit: number = 10, skip: number = 0) {
    try {
        const response = await fetch(`${BASE_URL}/users?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await response.json();
        return {
            users: data.users || [],
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || 0
        };
    } catch (error) {
        console.error('Erreur API utilisateurs:', error);
        return { users: [], total: 0, skip: 0, limit: 0 };
    }
}

export async function getFeedFilterOptions(categoryId: number | null) {
    const { data, error } = await supabase.rpc(
        'get_feed_filter_options',
        {
            p_category_id: categoryId,
        }
    );

    if (error) {
        throw error;
    }

    return normalizeFeedFilterOptions(data ?? []);
}



type FeedFilterRow = {
    key: string | null;
    id: number;
    name: string;
    input_type: string | null;
    multiple: boolean | null;
    option_id: string | number | null;
    option_name: string | null;
    option_value: string | number | null;
};

export type FilterOption = {
    id: string | number;
    name: string;
    value: string | number;
};

export type FeedFilterOptions = {
    conditions: FilterOption[];
    attributes: Array<{
        key: string;
        id: number;
        name: string;
        inputType: string;
        multiple: boolean;
        options: FilterOption[];
    }>;
};

function normalizeFeedFilterOptions(
    rows: FeedFilterRow[]
): FeedFilterOptions {
    const conditions: FilterOption[] = [];

    const attributesByKey = new Map<
        string,
        FeedFilterOptions['attributes'][number]
    >();

    for (const row of rows) {
        if (!row.key) {
            continue;
        }

        let attribute = attributesByKey.get(row.key);

        if (!attribute) {
            attribute = {
                key: row.key,
                id: row.id,
                name: row.name,
                inputType: row.input_type ?? 'select',
                multiple: Boolean(row.multiple),
                options: [],
            };

            attributesByKey.set(row.key, attribute);
        }

        if (
            row.option_id !== null &&
            row.option_name !== null &&
            row.option_value !== null
        ) {
            attribute.options.push({
                id: row.option_id,
                name: row.option_name,
                value: row.option_value,
            });
        }
    }

    return {
        conditions,
        attributes: [...attributesByKey.values()],
    };
}

// Plus tard tu peux ajouter d’autres appels ici : getAds, getUsers, etc.
