
const BASE_URL = 'https://dummyjson.com';

export async function getProducts(limit: number = 10, skip: number = 0) {
    try {
        const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Erreur lors du chargement des produits');
        const data = await response.json();
        return { 
            products: data.products || [],
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || 0
        };
    } catch (error) {
        console.error('Erreur API produits:', error);
        return { products: [], total: 0, skip: 0, limit: 0 };
    }
}

export async function getUsers(limit: number = 10, skip: number = 0) {
    try {
        const response = await fetch(`${BASE_URL}/users?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await response.json();
        return { 
            users: data.users || [],
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || 0
        };
    } catch (error) {
        console.error('Erreur API utilisateurs:', error);
        return { users: [], total: 0, skip: 0, limit: 0 };
    }
}

// Plus tard tu peux ajouter d’autres appels ici : getAds, getUsers, etc.
