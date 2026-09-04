import { supabase } from '@/src/lib/supabase';

export function toFrenchE164(value: string): string | null {
    const digits = value.replace(/\D/g, '');

    if (!/^0[67]\d{8}$/.test(digits)) {
        return null;
    }

    return `+33${digits.slice(1)}`;
}

export async function sendPhoneVerification(phone: string) {
    const { error } = await supabase.auth.updateUser({ phone });

    if (error) throw error;
}

export async function verifyPhoneVerification(phone: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'phone_change',
    });

    if (error) throw error;
}