import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getConversationContext,
    getConversationMessages,
    sendConversationMessage,
} from '@/src/lib/api/messages';

export function useConversationMessages(conversationId?: string) {
    const parsedConversationId = Number(conversationId);

    return useQuery({
        queryKey: ['conversation-messages', parsedConversationId],
        queryFn: () => getConversationMessages(parsedConversationId),
        enabled: Number.isInteger(parsedConversationId) && parsedConversationId > 0,
    });
}

export function useSendConversationMessage(
    conversationId?: string,
    currentUserId?: string
) {
    const queryClient = useQueryClient();
    const parsedConversationId = Number(conversationId);

    return useMutation({
        mutationFn: (content: string) => {
            if (!currentUserId) {
                throw new Error('Utilisateur non connecté');
            }

            return sendConversationMessage(
                parsedConversationId,
                currentUserId,
                content
            );
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ['conversation-messages', parsedConversationId],
            });

            void queryClient.invalidateQueries({
                queryKey: ['my-conversations', currentUserId],
            });
        },
    });
}

export function useConversationContext(conversationId?: string) {
    const parsedConversationId = Number(conversationId);

    return useQuery({
        queryKey: ['conversation-context', parsedConversationId],
        queryFn: () => getConversationContext(parsedConversationId),
        enabled: Number.isInteger(parsedConversationId) && parsedConversationId > 0,
    });
}