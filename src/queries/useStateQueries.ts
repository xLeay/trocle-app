import { getStates } from '@/src/lib/api/condition';
import { useQuery } from '@tanstack/react-query';

export function useStates() {
    return useQuery({
        queryKey: ['states'],
        queryFn: getStates,
        staleTime: 1000 * 60 * 60,
    });
}
