import {
    checkUsernameAvailability,
    getCheckEmailExists,
    getUserProfileByUsername
} from "@/src/lib/api/user";
import { useQuery } from "@tanstack/react-query";

// Check email exists
export function useCheckEmailExists(email: string) {
    return useQuery({
        queryKey: ['check-email-exists', email],
        queryFn: () => getCheckEmailExists(email),
        enabled: !!email,
        staleTime: 10_000,
    });
};


// Check username availability
export const usernameKeys = {
    all: ['username'] as const,
    availability: (username: string) => [...usernameKeys.all, 'availability', username] as const,
};

export function useUsernameAvailability(username: string) {
    const normalizedUsername = username.trim().toLowerCase();
    const hasMinimumLength = normalizedUsername.length >= 3;

    return useQuery({
        queryKey: usernameKeys.availability(normalizedUsername),
        queryFn: () => checkUsernameAvailability(normalizedUsername),
        enabled: hasMinimumLength,
        staleTime: 30_000,
    });
}





// Profile

// --- Keys ---
export const userProfileKeys = {
    all: ['user-profile'] as const,
    byId: (userId: string) => [...userProfileKeys.all, 'id', userId] as const,
    byUsername: (username: string) => [...userProfileKeys.all, 'username', username] as const,
};

// --- Queries ---

export function useUserProfileByUsername(username: string) {
    const normalizedUsername = username.trim().toLowerCase();

    return useQuery({
        queryKey: userProfileKeys.byUsername(normalizedUsername),
        queryFn: () => getUserProfileByUsername(normalizedUsername),
        enabled: normalizedUsername.length > 0,
    });
}
