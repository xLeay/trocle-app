import { useMutation } from '@tanstack/react-query';

import { completeOnboarding, CompleteOnboardingInput } from '@/src/lib/api/onboarding';

export function useCompleteOnboarding() {
    return useMutation<void, Error, CompleteOnboardingInput>({
        mutationFn: completeOnboarding,
    });
}