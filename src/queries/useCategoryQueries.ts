import { getBigCategories, getCategories } from '@/src/lib/api/category';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
    });
}

export function useBigCategories() {
    return useQuery({
        queryKey: ['big-categories'],
        queryFn: getBigCategories,
        staleTime: 1000 * 60 * 60,
    });
}