import { useQuery } from '@tanstack/react-query';

import { getMyConversations } from '@/src/lib/api/messages';

export function useMyConversations(userId?: string) {
    return useQuery({
        queryKey: ['my-conversations', userId],
        queryFn: () => getMyConversations(userId!),
        enabled: Boolean(userId),
    });
}