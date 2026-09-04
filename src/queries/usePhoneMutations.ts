import { useMutation } from '@tanstack/react-query';

import { sendPhoneVerification, verifyPhoneVerification } from '@/src/lib/api/phone';

export function useSendPhoneVerification() {
    return useMutation({
        mutationFn: sendPhoneVerification,
    });
}

export function useVerifyPhoneVerification() {
    return useMutation({
        mutationFn: ({ phone, token }: { phone: string; token: string }) =>
            verifyPhoneVerification(phone, token),
    });
}