import { getCheckEmailExists } from "@/src/lib/api/user";
import { useQuery } from "@tanstack/react-query";

export const useCheckEmailExists = (email: string) => {
    return useQuery({
        queryKey: ['check-email-exists', email],
        queryFn: () => getCheckEmailExists(email),
        enabled: !!email,
        staleTime: 10_000,
    });
};