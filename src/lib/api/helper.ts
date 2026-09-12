import { supabase } from '@/src/lib/supabase';

export function getPublicStorageUrl(
    bucket: string,
    pathOrUrl: string | null | undefined
): string | null {
    if (!pathOrUrl) return null;

    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }

    return supabase.storage
        .from(bucket)
        .getPublicUrl(pathOrUrl)
        .data.publicUrl;
}