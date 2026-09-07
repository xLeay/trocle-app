import { getAvatarModeration, getAvatarModerationMessage } from '@/src/lib/api/avatar-moderation';
import { useQuery } from '@tanstack/react-query';

export function useAvatarModeration(
    uri: string,
    enabled: boolean
) {
    return useQuery({
        queryKey: ['avatar-moderation', uri],
        queryFn: () => getAvatarModeration(uri),
        enabled: enabled && !!uri,
        staleTime: 0,
        gcTime: 0,
    });
}

export function useAvatarModerationMessage(reason: string | null) {
    return getAvatarModerationMessage(reason);
}

