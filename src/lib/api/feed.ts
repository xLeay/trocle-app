
const BASE_URL = 'https://api.escuelajs.co/api/v1';

export async function getProducts(limit?: number, offset?: number) {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Erreur lors du chargement des produits');

    return response.json();
}

// Plus tard tu peux ajouter d’autres appels ici : fetchAds, fetchUsers, etc.
