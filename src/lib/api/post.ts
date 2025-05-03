const BASE_URL = 'https://api.escuelajs.co/api/v1';

export async function fetchPosts() {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('Erreur lors du chargement des posts');
    }

    return data;
}

export async function toggleLike(postId: number, liked: boolean) {
    const method = liked ? 'DELETE' : 'POST';
    const response = await fetch(`${BASE_URL}/products/${postId}/like`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors du like/unlike');
    }

    return response.json();
}
