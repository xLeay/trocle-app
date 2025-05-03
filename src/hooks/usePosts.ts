import { useEffect, useState } from 'react';
import { fetchPosts } from '../lib/api/post';

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { posts, loading, error };
}
