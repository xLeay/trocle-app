import { supabase } from "@/src/lib/supabase";

export async function getCheckEmailExists(email: string) {
    const { data, error } = await supabase.from('user').select('id').eq('email', email).maybeSingle();
    if (error) {
        throw error;
    }
    return data;
}


export type UsernameAvailability = {
    available: boolean;
    reason: 'format' | 'reserved' | 'taken' | null;
};

export async function checkUsernameAvailability(username: string): Promise<UsernameAvailability> {
    const { data, error } = await supabase.rpc('check_username_availability', { candidate: username });
    if (error) {
        throw error;
    }
    return data[0];
}



// Cette structure pour les api et les queries :
// /lib/api/
//   user.ts
//   product.ts
//   troc.ts
//   category.ts
//   brand.ts
//   notification.ts
//   certification.ts
//   transaction.ts

// /queries/
//   useUserQueries.ts
//   useProductQueries.ts
//   useTrocQueries.ts
//   useCategoryQueries.ts
//   useBrandQueries.ts
//   useNotificationQueries.ts
//   useCertificationQueries.ts
//   useTransactionQueries.ts