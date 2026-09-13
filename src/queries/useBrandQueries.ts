import { useQuery } from '@tanstack/react-query';

import { getBrands } from '@/src/lib/api/brand';

export function useBrands() {
    return useQuery({
        queryKey: ['brands'],
        queryFn: getBrands,
        staleTime: 1000 * 60 * 60,
    });
}