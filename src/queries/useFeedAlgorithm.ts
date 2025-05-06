import {
    Product,
    User,
    FeedItem,
    InterleavePatternItem
} from '@/src/types/feed';

const generateUniqueId = (type: string, index: number) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${type}-${index}-${timestamp}-${random}`;
};

export function assembleFeed(
    products: Product[],
    users: User[],
    userProducts: { user: User; products: Product[] }[],
    pattern: InterleavePatternItem[]
): FeedItem[] {
    const feed: FeedItem[] = [];
    let p = 0, u = 0, up = 0;

    while (p < products.length || u < users.length || up < userProducts.length) {
        const snapshot = feed.length;

        for (const slot of pattern) {
            // Plus rien à consommer → sortie anticipée
            if (p >= products.length && u >= users.length && up >= userProducts.length) break;

            if (typeof slot === 'number' && p < products.length) {
                const productGroup = products.slice(p, p + slot);
                if (productGroup.length > 0) {
                    feed.push({
                        type: 'product_group',
                        data: productGroup,
                        id: generateUniqueId('product-group', p)
                    });
                    p += productGroup.length;
                }
            }
            else if (slot === 'suggested_users' && u < users.length) {
                const userGroup = users.slice(u, u + 4); // Groupes de 4 users
                feed.push({
                    type: 'suggested_users',
                    data: userGroup,
                    id: generateUniqueId('users', p)
                });
                u += userGroup.length;
            }
            else if (slot === 'suggested_user_products' && up < userProducts.length) {
                feed.push({
                    type: 'suggested_user_products',
                    data: userProducts[up++],
                    id: generateUniqueId('user-products', p)
                });
            }
            else if (slot === 'ad') {
                feed.push({
                    type: 'ad',
                    id: generateUniqueId('ad', p)
                });
            }
        }

        // Protection contre boucle infinie
        if (feed.length === snapshot) break;
    }

    return feed;
}
