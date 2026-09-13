import { supabase } from '@/src/lib/supabase';
import { getPublicStorageUrl } from './helper';

export type PrivateConversation = {
    id: string;
    otherUserId: string;
    name: string;
    profilePicture: string | null;
    lastMessage: string;
    lastMessageSentAt: string | null;
    read: boolean;
    certificationSlug: string | null;
};

type GetMyConversationsRow = {
    conversation_id: number;
    other_user_id: string;
    other_username: string;
    other_profile_picture: string | null;
    last_message_content: string | null;
    last_message_sent_at: string | null;
    last_message_sender_id: string | null;
    last_message_read_at: string | null;
    certification_slug: string | null;
};

export type MessageAttachment = {
    id: number;
    created_at: string;
    file_path: string;
    file_type: string;
    file_size: number | null;
    id_message: number;
};

export type ConversationMessage = {
    id: number;
    message_type: 'text' | 'troc_proposal';
    message_content: string;
    sent_at: string;
    read_at: string | null;
    has_attachment: boolean;
    reply_to_id_message: number | null;
    id_conversation: number;
    id_sender: string;
    id_troc: number | null;
    attachments: MessageAttachment[];
};

export type ConversationContext = {
    otherUserId: string;
    otherUsername: string;
    otherProfilePicture: string | null;
    otherBio: string | null;
    certificationSlug: string | null;
};

type ConversationContextRow = {
    other_user_id: string;
    other_username: string;
    other_profile_picture: string | null;
    other_bio: string | null;
    certification_slug: string | null;
};

export async function getMyConversations(
    currentUserId: string
): Promise<PrivateConversation[]> {
    const { data, error } = await supabase.rpc('get_my_conversations');

    if (error) {
        throw error;
    }

    return ((data ?? []) as GetMyConversationsRow[]).map((conversation) => ({
        id: String(conversation.conversation_id),
        otherUserId: conversation.other_user_id,
        name: conversation.other_username,
        profilePicture: getPublicStorageUrl('user-images', conversation.other_profile_picture),
        lastMessage: conversation.last_message_content ?? 'Aucun message pour le moment',
        lastMessageSentAt: conversation.last_message_sent_at,
        certificationSlug: conversation.certification_slug,

        // Un message reçu sans read_at est considéré non lu.
        read:
            conversation.last_message_sender_id === currentUserId ||
            conversation.last_message_read_at !== null,
    }));
}

export async function getConversationMessages(
    conversationId: number
): Promise<ConversationMessage[]> {
    const { data, error } = await supabase
        .from('message')
        .select(`
            id,
            message_type,
            message_content,
            sent_at,
            read_at,
            has_attachment,
            reply_to_id_message,
            id_conversation,
            id_sender,
            id_troc,
            attachments:message_attachment(
                id,
                created_at,
                file_path,
                file_type,
                file_size,
                id_message
            )
        `)
        .eq('id_conversation', conversationId)
        .order('sent_at', { ascending: true });

    if (error) {
        throw error;
    }

    return ((data ?? []) as ConversationMessage[]).map((message) => ({
        ...message,
        attachments: message.attachments ?? [],
    }));
}

export async function sendConversationMessage(
    conversationId: number,
    senderId: string,
    content: string
): Promise<ConversationMessage> {
    const { data, error } = await supabase
        .from('message')
        .insert({
            id_conversation: conversationId,
            id_sender: senderId,
            message_content: content.trim(),
            message_type: 'text',
            has_attachment: false,
        })
        .select(`
            id,
            message_type,
            message_content,
            sent_at,
            read_at,
            has_attachment,
            reply_to_id_message,
            id_conversation,
            id_sender,
            id_troc,
            attachments:message_attachment(
                id,
                created_at,
                file_path,
                file_type,
                file_size,
                id_message
            )
        `)
        .single();

    if (error) {
        throw error;
    }

    return {
        ...(data as ConversationMessage),
        attachments: (data as ConversationMessage).attachments ?? [],
    };
}

export async function getConversationContext(
    conversationId: number
): Promise<ConversationContext | null> {
    const { data, error } = await supabase.rpc('get_conversation_context', {
        p_conversation_id: conversationId,
    });

    if (error) {
        throw error;
    }

    const context = (data?.[0] ?? null) as ConversationContextRow | null;

    if (!context) {
        return null;
    }

    return {
        otherUserId: context.other_user_id,
        otherUsername: context.other_username,
        otherProfilePicture: getPublicStorageUrl('user-images', context.other_profile_picture),
        otherBio: context.other_bio,
        certificationSlug: context.certification_slug,
    };
}