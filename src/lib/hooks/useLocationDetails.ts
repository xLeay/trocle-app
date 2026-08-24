import { fetchLocationDetails } from '@/src/lib/utils/location';
import { useQuery } from '@tanstack/react-query';

export function useLocationDetails(cityName: string) {
    return useQuery({
        queryKey: ['locationDetails', cityName],
        queryFn: () => fetchLocationDetails(cityName),
        enabled: Boolean(cityName),
        staleTime: 1000 * 60 * 60 * 24, // Cache les résultats 24h
    });
}