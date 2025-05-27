import { supabase } from "@/src/lib/supabase";

export async function getCheckEmailExists(email: string) {
    const { data, error } = await supabase.from('user').select('id').eq('email', email).maybeSingle();
    if (error) {
        throw error;
    }
    return data;
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