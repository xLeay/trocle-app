import { supabase } from '@/src/lib/supabase';

export type State = {
    id: number;
    name: string;
    slug: string;
};

export async function getStates(): Promise<State[]> {
    const { data, error } = await supabase
        .from('state')
        .select('id, name, slug')

    if (error) throw error;

    return data.map((state) => ({
        id: state.id,
        name: state.name,
        slug: state.slug,
    }));
}

