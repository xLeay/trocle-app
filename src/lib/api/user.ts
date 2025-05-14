import { supabase } from "@/src/lib/supabase";
import { useQuery } from '@tanstack/react-query';

export async function getVehicles() {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) {
        throw error;
    }
    return data;
}

export const useVehicles = () => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: getVehicles,
    });
};

export async function getCheckEmailExists(email: string) {
    const { data, error } = await supabase.from('user').select('id').eq('email', email).maybeSingle();
    if (error) {
        throw error;
    }
    return data;
}

export const useCheckEmailExists = (email: string) => {
    return useQuery({
        queryKey: ['check-email-exists', email],
        queryFn: () => getCheckEmailExists(email),
        enabled: !!email,
        staleTime: 10_000,
    });
};
