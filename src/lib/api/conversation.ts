import { supabase } from '@/src/lib/supabase';

export async function sendMatchMessage(
    recipientId: string,
    content: string
): Promise<string> {
    const { data, error } = await supabase.rpc(
        'send_match_message',
        {
            p_recipient_id: recipientId,
            p_content: content,
        }
    );

    if (error) {
        throw error;
    }

    return String(data);
}