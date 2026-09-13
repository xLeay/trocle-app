import { supabase } from '@/src/lib/supabase';

export type HomeDeckProduct = {
    id: string;
    title: string;
    brand: string;
    seller: string;
    distance: string;
    state: string;
    trocoins: number;
    images: string[];
};

export type MatchResult = {
    matched_user_id: string;
    matched_username: string;
    matched_profile_picture: string | null;
    my_product_id: number;
    my_product_name: string;
    my_product_photo_url: string | null;
    their_product_id: number;
    their_product_name: string;
    their_product_photo_url: string | null;
    matched_at: string;
};

type PublicProductLocation = {
    product_id: number;
    city: string;
    distance_meters: number | null;
};

type ProductRow = {
    id: number;
    name: string;
    price_trocoin: number;
    id_user: string | null;
    brand: { name: string } | { name: string }[] | null;
    state: { name: string } | { name: string }[] | null;
    owner:
    | {
        username: string | null;
    }
    | {
        username: string | null;
    }[]
    | null;
    photos: Array<{
        url: string;
        order_position: number;
    }>;
};

function unwrapRelation<T>(value: T | T[] | null): T | null {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value;
}

function getProductImageUrl(pathOrUrl: string): string {
    if (
        pathOrUrl.startsWith('http://') ||
        pathOrUrl.startsWith('https://')
    ) {
        return pathOrUrl;
    }

    return supabase.storage
        .from('product-images')
        .getPublicUrl(pathOrUrl)
        .data.publicUrl;
}

export async function getHomeDeckProducts(
    userId: string,
    limit = 200
): Promise<HomeDeckProduct[]> {
    const [{ data: swipes, error: swipesError }, { data, error }] =
        await Promise.all([
            supabase
                .from('user_product_swipes')
                .select('id_product')
                .eq('id_user', userId),

            supabase
                .from('product')
                .select(`
          id,
          name,
          price_trocoin,
          id_user,
          brand:brand!product_id_brand_fkey (
            name
          ),
          state:state!product_id_state_fkey (
            name
          ),
          owner:user!product_id_user_fkey (
            username
          ),
          photos:product_photos!product_photos_id_product_fkey (
            url,
            order_position
          )
        `)
                .eq('is_active', true)
                .neq('id_user', userId)
                .order('created_at', { ascending: false })
                .limit(limit),
        ]);

    if (swipesError) {
        throw swipesError;
    }

    if (error) {
        throw error;
    }

    const swipedProductIds = new Set(
        (swipes ?? []).map((swipe) => swipe.id_product)
    );

    const rows = ((data ?? []) as ProductRow[]).filter(
        (product) => !swipedProductIds.has(product.id)
    );

    const productIds = rows.map((product) => product.id);

    const { data: locations, error: locationsError } = await supabase.rpc(
        'get_product_locations_public',
        {
            p_product_ids: productIds,
            p_limit: productIds.length,
            p_offset: 0,
        }
    );

    if (locationsError) {
        throw locationsError;
    }

    const typedLocations = (locations ?? []) as PublicProductLocation[];

    const locationsByProductId = new Map<number, PublicProductLocation>(
        typedLocations.map((location) => [
            location.product_id,
            location,
        ])
    );

    return rows.map((product) => {
        const brand = unwrapRelation(product.brand);
        const state = unwrapRelation(product.state);
        const owner = unwrapRelation(product.owner);
        const location = locationsByProductId.get(product.id);

        const images = (product.photos ?? [])
            .sort((first, second) => first.order_position - second.order_position)
            .map((photo) => getProductImageUrl(photo.url));

        const distance = location?.distance_meters
            ? `${(location.distance_meters / 1_000).toFixed(1).replace('.', ',')} km`
            : location?.city ?? 'Localisation inconnue';

        return {
            id: String(product.id),
            title: product.name,
            brand: brand?.name ?? 'Sans marque',
            seller: owner?.username ?? 'Membre Trocle',
            distance,
            state: state?.name ?? 'État non renseigné',
            trocoins: product.price_trocoin,
            images,
        };
    });
}

export async function createHomeSwipe(
    productId: string,
    swipeType: 'like' | 'pass'
): Promise<MatchResult | null> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('Utilisateur non connecté.');
    }

    const { error: swipeError } = await supabase
        .from('user_product_swipes')
        .insert({
            id_user: user.id,
            id_product: Number(productId),
            swipe_type: swipeType,
        });

    if (swipeError) {
        throw swipeError;
    }

    if (swipeType !== 'like') {
        return null;
    }

    const { data: matches, error: matchesError } = await supabase.rpc(
        'get_my_matches'
    );

    if (matchesError) {
        throw matchesError;
    }

    return (
        (matches as MatchResult[]).find(
            (match) => match.their_product_id === Number(productId)
        ) ?? null
    );
}