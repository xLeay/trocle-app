import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

const EXPECTED_DEV_PROJECT_REF = 'jrahgcuzkehdugaekiqi';
const SEED_TAG = 'trocle-dev';
const DEFAULT_SEED = 'trocle-september-2026';
const TEST_PASSWORD = 'TrocleDev!2026';

const FIRST_NAMES = [
    'Léa', 'Noah', 'Inès', 'Hugo', 'Zoé', 'Arthur', 'Emma', 'Lucas',
    'Jade', 'Louis', 'Manon', 'Théo', 'Camille', 'Nathan', 'Clara',
    'Paul', 'Sarah', 'Tom', 'Louise', 'Maxime',
];

const LAST_NAMES = [
    'Martin', 'Bernard', 'Durand', 'Rousseau', 'Petit', 'Leroy',
    'Moreau', 'Simon', 'Laurent', 'Michel', 'Lefèvre', 'Garcia',
    'David', 'Bertrand', 'Roux', 'Vincent',
];

const CITIES = [
    {
        city: 'Paris',
        postcode: '75011',
        department: 'Paris',
        latitude: 48.8572,
        longitude: 2.3834,
    },
    {
        city: 'Lyon',
        postcode: '69007',
        department: 'Rhône',
        latitude: 45.7446,
        longitude: 4.8422,
    },
    {
        city: 'Bordeaux',
        postcode: '33000',
        department: 'Gironde',
        latitude: 44.8378,
        longitude: -0.5792,
    },
    {
        city: 'Lille',
        postcode: '59000',
        department: 'Nord',
        latitude: 50.6292,
        longitude: 3.0573,
    },
    {
        city: 'Nantes',
        postcode: '44000',
        department: 'Loire-Atlantique',
        latitude: 47.2184,
        longitude: -1.5536,
    },
    {
        city: 'Toulouse',
        postcode: '31000',
        department: 'Haute-Garonne',
        latitude: 43.6047,
        longitude: 1.4442,
    },
];

type SeedConfig = {
    seed: string;
    users: number;
    minProducts: number;
    maxProducts: number;
};

type SeedUser = {
    index: number;
    key: string;
    email: string;
    username: string;
    bio: string;
    gender: 'female' | 'male';
    birthDate: string;
    trocoins: number;
    location: (typeof CITIES)[number];
};

type SeedProduct = {
    key: string;
    ownerKey: string;
    name: string;
    description: string;
    priceTrocoin: number;
    categoryId: number;
    stateId: number;
    brandId: number | null;
    location: (typeof CITIES)[number];
    imageId: string;
};

type MatchPair = {
    firstUserKey: string;
    secondUserKey: string;
    firstProductKey: string;
    secondProductKey: string;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

type State = {
    id: number;
    name: string;
    slug: string;
};

type Brand = {
    id: number;
    name: string;
    slug: string;
};

type CategoryAttribute = {
    id_attribute_def: number;
    required: boolean;
    input_type: string | null;
    options: string[] | null;
};

const config = parseConfig();
const supabaseUrl = requiredEnv('SUPABASE_DEV_URL');
const serviceRoleKey = requiredEnv('SUPABASE_DEV_SERVICE_ROLE_KEY');

assertDevTarget(supabaseUrl);

const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    console.log(`\nSeed DEV "${config.seed}" en cours…`);
    console.log(
        `${config.users} utilisateurs, ${config.minProducts}-${config.maxProducts} produits/utilisateur.\n`
    );

    const [categories, states, existingBrands] = await Promise.all([
        loadCategories(),
        loadStates(),
        loadExistingBrands(),
    ]);

    if (categories.length === 0) {
        throw new Error('Aucune catégorie active disponible.');
    }

    if (states.length === 0) {
        throw new Error('Aucun état disponible.');
    }

    const seedUsers = generateUsers(config);
    const userIds = new Map<string, string>();

    for (const user of seedUsers) {
        const userId = await ensureUser(user);
        userIds.set(user.key, userId);
    }

    const generatedBrands = await ensureGeneratedBrands(
        seedUsers,
        userIds,
        config
    );

    const brands = [...existingBrands, ...generatedBrands];
    const seedProducts = generateProducts(
        seedUsers,
        categories,
        states,
        brands,
        config
    );

    const productIds = new Map<string, number>();

    for (const product of seedProducts) {
        const ownerId = requiredMapValue(userIds, product.ownerKey, 'utilisateur');
        const productId = await ensureProduct(product, ownerId);
        productIds.set(product.key, productId);
    }

    const matchPairs = generateMatchPairs(seedUsers, seedProducts, config);

    await seedLikes(userIds, productIds, seedUsers, seedProducts, config);
    await seedSwipes(
        userIds,
        productIds,
        seedUsers,
        seedProducts,
        matchPairs,
        config
    );

    await seedMatchConversations(userIds, productIds, matchPairs);
    await seedTrocs(userIds, productIds, matchPairs);

    console.log('\nSeed DEV terminé.');
    console.log(`- ${seedUsers.length} comptes Auth et profils`);
    console.log(`- ${generatedBrands.length} marques DEV créées ou mises à jour`);
    console.log(`- ${seedProducts.length} produits avec photos et localisations`);
    console.log(`- ${matchPairs.length} matchs par swipes réciproques`);
    console.log(
        '- likes Discover, swipes Home, conversations et trocs générés'
    );
}

function generateUsers(seedConfig: SeedConfig): SeedUser[] {
    return Array.from({ length: seedConfig.users }, (_, index) => {
        const userNumber = index + 1;
        const rng = createRng(`${seedConfig.seed}:user:${userNumber}`);

        const firstName = rng.pick(FIRST_NAMES);
        const lastName = rng.pick(LAST_NAMES);
        const gender = rng.bool() ? 'female' : 'male';
        const location = rng.pick(CITIES);
        const birthYear = rng.int(1986, 2003);
        const birthMonth = String(rng.int(1, 12)).padStart(2, '0');
        const birthDay = String(rng.int(1, 28)).padStart(2, '0');
        const key = `u${String(userNumber).padStart(3, '0')}`;
        const username = normalizeUsername(
            `${firstName}_${lastName}_${String(userNumber).padStart(2, '0')}`
        );

        return {
            index: userNumber,
            key,
            email: `seed-${seedConfig.seed}-${key}@trocle.dev`,
            username,
            bio: rng.pick([
                'Je donne une seconde vie aux objets que je n’utilise plus.',
                'Passionné(e) de bonnes trouvailles et de consommation responsable.',
                'Toujours partant(e) pour un troc local et simple.',
                'Mode, déco et petits objets du quotidien.',
                'Je chine, je répare et je partage mes coups de cœur.',
            ]),
            gender,
            birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
            trocoins: rng.int(250, 1_500),
            location,
        };
    });
}

async function ensureUser(user: SeedUser): Promise<string> {
    let userId = await findAuthUserIdByEmail(user.email);

    if (!userId) {
        const { data, error } = await admin.auth.admin.createUser({
            email: user.email,
            password: TEST_PASSWORD,
            email_confirm: true,
            user_metadata: {
                seedTag: SEED_TAG,
                seedKey: user.key,
            },
        });

        if (error || !data.user) {
            throw new Error(
                `Création Auth impossible pour ${user.email}: ${error?.message}`
            );
        }

        userId = data.user.id;
    }

    const avatarPath = `avatars/${userId}/avatar.jpg`;

    await uploadRemoteImage(
        'user-images',
        avatarPath,
        `https://picsum.photos/seed/${encodeURIComponent(
            `${config.seed}-${user.key}-avatar`
        )}/600/600`
    );

    const { error } = await admin
        .from('user')
        .upsert(
            {
                id: userId,
                email: user.email,
                username: user.username,
                bio: user.bio,
                birth_date: user.birthDate,
                gender: user.gender,
                profile_picture: avatarPath,
                trocoin_balance: user.trocoins,
                has_completed_onboarding: true,
            },
            {
                onConflict: 'id',
            }
        );

    if (error) {
        throw new Error(`Mise à jour profil impossible: ${error.message}`);
    }

    return userId;
}

async function ensureGeneratedBrands(
    users: SeedUser[],
    userIds: Map<string, string>,
    seedConfig: SeedConfig
): Promise<Brand[]> {
    const brandCount = Math.max(4, Math.ceil(users.length / 5));
    const result: Brand[] = [];

    for (let index = 1; index <= brandCount; index += 1) {
        const rng = createRng(`${seedConfig.seed}:brand:${index}`);
        const owner = users[(index - 1) % users.length];
        const ownerId = requiredMapValue(userIds, owner.key, 'utilisateur');
        const slug = `dev-seed-${normalizeSlug(seedConfig.seed)}-brand-${index}`;
        const name = `${SEED_TAG}:${seedConfig.seed} ${rng.pick([
            'Atelier Aube',
            'Maison Épure',
            'Studio Mistral',
            'Collectif Sillage',
            'Ligne Horizon',
            'Éditions Rivage',
            'Atelier Nacré',
            'Maison Serein',
        ])} ${index}`;

        const { data: existing, error: findError } = await admin
            .from('brand')
            .select('id, name, slug')
            .eq('slug', slug)
            .maybeSingle();

        if (findError) {
            throw new Error(`Recherche marque impossible: ${findError.message}`);
        }

        let brand: Brand;

        if (existing) {
            const { data, error } = await admin
                .from('brand')
                .update({
                    name,
                    is_active: true,
                })
                .eq('id', existing.id)
                .select('id, name, slug')
                .single();

            if (error || !data) {
                throw new Error(`Mise à jour marque impossible: ${error?.message}`);
            }

            brand = data;
        } else {
            const { data, error } = await admin
                .from('brand')
                .insert({
                    name,
                    slug,
                    is_active: true,
                    is_verified: false,
                })
                .select('id, name, slug')
                .single();

            if (error || !data) {
                throw new Error(`Création marque impossible: ${error?.message}`);
            }

            brand = data;
        }

        const { error: creatorError } = await admin
            .from('brand_created_by')
            .upsert(
                {
                    id_brand: brand.id,
                    id_user: ownerId,
                },
                {
                    onConflict: 'id_brand',
                }
            );

        if (creatorError) {
            throw new Error(
                `Association créateur/marque impossible: ${creatorError.message}`
            );
        }

        result.push(brand);
    }

    return result;
}

function generateProducts(
    users: SeedUser[],
    categories: Category[],
    states: State[],
    brands: Brand[],
    seedConfig: SeedConfig
): SeedProduct[] {
    const products: SeedProduct[] = [];

    for (const user of users) {
        const rng = createRng(`${seedConfig.seed}:products:${user.key}`);
        const count = rng.int(seedConfig.minProducts, seedConfig.maxProducts);

        for (let productIndex = 1; productIndex <= count; productIndex += 1) {
            const category = rng.pick(categories);
            const state = rng.pick(states);
            const brand = rng.bool(0.7) && brands.length > 0
                ? rng.pick(brands)
                : null;

            const productKey = `${user.key}-p${String(productIndex).padStart(2, '0')}`;
            const adjective = rng.pick([
                'vintage',
                'pratique',
                'minimaliste',
                'coloré',
                'intemporel',
                'soigné',
                'original',
                'confortable',
            ]);

            products.push({
                key: productKey,
                ownerKey: user.key,
                name: `[DEV-SEED:${seedConfig.seed}] ${category.name} ${adjective} ${productIndex}`,
                description: [
                    `Article de démonstration en ${state.name.toLowerCase()}.`,
                    'Photos et informations créées automatiquement pour tester Trocle.',
                    'Disponible pour un échange local ou une proposition de troc.',
                ].join(' '),
                priceTrocoin: rng.int(40, 650),
                categoryId: category.id,
                stateId: state.id,
                brandId: brand?.id ?? null,
                location: user.location,
                imageId: deterministicUuid(`${seedConfig.seed}:${productKey}`),
            });
        }
    }

    return products;
}

async function ensureProduct(
    product: SeedProduct,
    ownerId: string
): Promise<number> {
    const photoPath = `products/${ownerId}/${product.imageId}/1.jpg`;

    await uploadRemoteImage(
        'product-images',
        photoPath,
        `https://picsum.photos/seed/${encodeURIComponent(
            `${config.seed}-${product.key}`
        )}/900/1200`
    );

    const existing = await findSeedProduct(product.name, ownerId);

    if (existing) {
        const { error } = await admin
            .from('product')
            .update({
                description: product.description,
                price_trocoin: product.priceTrocoin,
                id_category: product.categoryId,
                id_state: product.stateId,
                id_brand: product.brandId,
                is_active: true,
            })
            .eq('id', existing.id);

        if (error) {
            throw new Error(`Mise à jour produit impossible: ${error.message}`);
        }

        await ensureProductPhoto(existing.id, photoPath);
        return existing.id;
    }

    const attributes = await getRequiredAttributes(product.categoryId);

    const { data: productId, error: createError } = await admin.rpc(
        'create_product_transaction',
        {
            p_owner_id: ownerId,
            p_name: product.name,
            p_description: product.description,
            p_category_id: product.categoryId,
            p_state_id: product.stateId,
            p_city: product.location.city,
            p_postcode: product.location.postcode,
            p_department: product.location.department,
            p_latitude: product.location.latitude,
            p_longitude: product.location.longitude,
            p_attributes: attributes,
            p_photos: [
                {
                    path: photoPath,
                    position: 1,
                },
            ],
        }
    );

    if (createError || typeof productId !== 'number') {
        throw new Error(
            `Création produit impossible: ${createError?.message ?? 'ID absent'}`
        );
    }

    const { error: updateError } = await admin
        .from('product')
        .update({
            price_trocoin: product.priceTrocoin,
            id_brand: product.brandId,
        })
        .eq('id', productId);

    if (updateError) {
        throw new Error(`Finalisation produit impossible: ${updateError.message}`);
    }

    return productId;
}

async function getRequiredAttributes(categoryId: number) {
    const { data, error } = await admin
        .from('category_attributes_resolved')
        .select('id_attribute_def, required, input_type, options')
        .eq('id_category', categoryId)
        .eq('required', true);

    if (error) {
        throw new Error(`Lecture attributs impossible: ${error.message}`);
    }

    return ((data ?? []) as CategoryAttribute[]).map((attribute) => ({
        attributeId: attribute.id_attribute_def,
        values: defaultAttributeValues(attribute.input_type, attribute.options),
    }));
}

function defaultAttributeValues(
    inputType: string | null,
    options: string[] | null
): string[] {
    if (
        (inputType === 'select' || inputType === 'multi_select') &&
        Array.isArray(options) &&
        options.length > 0
    ) {
        return [options[0]];
    }

    if (inputType === 'boolean') {
        return ['false'];
    }

    if (inputType === 'number') {
        return ['1'];
    }

    return ['Non précisé'];
}

function generateMatchPairs(
    users: SeedUser[],
    products: SeedProduct[],
    seedConfig: SeedConfig
): MatchPair[] {
    const rng = createRng(`${seedConfig.seed}:matches`);
    const shuffledUsers = rng.shuffle([...users]);
    const pairCount = Math.max(2, Math.floor(users.length / 5));
    const pairs: MatchPair[] = [];

    for (let index = 0; index < pairCount; index += 1) {
        const firstUser = shuffledUsers[index * 2];
        const secondUser = shuffledUsers[index * 2 + 1];

        if (!firstUser || !secondUser) {
            break;
        }

        const firstProducts = products.filter(
            (product) => product.ownerKey === firstUser.key
        );
        const secondProducts = products.filter(
            (product) => product.ownerKey === secondUser.key
        );

        if (firstProducts.length === 0 || secondProducts.length === 0) {
            continue;
        }

        pairs.push({
            firstUserKey: firstUser.key,
            secondUserKey: secondUser.key,
            firstProductKey: rng.pick(firstProducts).key,
            secondProductKey: rng.pick(secondProducts).key,
        });
    }

    return pairs;
}

async function seedLikes(
    userIds: Map<string, string>,
    productIds: Map<string, number>,
    users: SeedUser[],
    products: SeedProduct[],
    seedConfig: SeedConfig
) {
    const rng = createRng(`${seedConfig.seed}:likes`);
    const rows = new Map<string, { id_user: string; id_product: number }>();

    for (const user of users) {
        const candidates = products.filter(
            (product) => product.ownerKey !== user.key
        );

        for (let index = 0; index < rng.int(2, 5); index += 1) {
            const product = rng.pick(candidates);
            const idUser = requiredMapValue(userIds, user.key, 'utilisateur');
            const idProduct = requiredMapValue(productIds, product.key, 'produit');

            rows.set(`${idUser}:${idProduct}`, {
                id_user: idUser,
                id_product: idProduct,
            });
        }
    }

    const { error } = await admin
        .from('user_product_likes')
        .upsert([...rows.values()], {
            onConflict: 'id_user,id_product',
        });

    if (error) {
        throw new Error(`Création likes impossible: ${error.message}`);
    }
}

async function seedSwipes(
    userIds: Map<string, string>,
    productIds: Map<string, number>,
    users: SeedUser[],
    products: SeedProduct[],
    matchPairs: MatchPair[],
    seedConfig: SeedConfig
) {
    const rng = createRng(`${seedConfig.seed}:swipes`);
    const rows = new Map<
        string,
        {
            id_user: string;
            id_product: number;
            swipe_type: 'like' | 'pass';
        }
    >();

    const addSwipe = (
        userKey: string,
        productKey: string,
        swipeType: 'like' | 'pass'
    ) => {
        const idUser = requiredMapValue(userIds, userKey, 'utilisateur');
        const idProduct = requiredMapValue(productIds, productKey, 'produit');

        rows.set(`${idUser}:${idProduct}`, {
            id_user: idUser,
            id_product: idProduct,
            swipe_type: swipeType,
        });
    };

    for (const match of matchPairs) {
        addSwipe(match.firstUserKey, match.secondProductKey, 'like');
        addSwipe(match.secondUserKey, match.firstProductKey, 'like');
    }

    for (const user of users) {
        const candidates = products.filter(
            (product) => product.ownerKey !== user.key
        );

        for (let index = 0; index < rng.int(4, 9); index += 1) {
            const product = rng.pick(candidates);
            const idUser = requiredMapValue(userIds, user.key, 'utilisateur');
            const idProduct = requiredMapValue(productIds, product.key, 'produit');
            const rowKey = `${idUser}:${idProduct}`;

            if (!rows.has(rowKey)) {
                addSwipe(user.key, product.key, rng.bool(0.42) ? 'like' : 'pass');
            }
        }
    }

    const { error } = await admin
        .from('user_product_swipes')
        .upsert([...rows.values()], {
            onConflict: 'id_user,id_product',
        });

    if (error) {
        throw new Error(`Création swipes impossible: ${error.message}`);
    }
}

async function seedMatchConversations(
    userIds: Map<string, string>,
    productIds: Map<string, number>,
    matches: MatchPair[]
) {
    for (const match of matches) {
        const firstUserId = requiredMapValue(
            userIds,
            match.firstUserKey,
            'utilisateur'
        );
        const secondUserId = requiredMapValue(
            userIds,
            match.secondUserKey,
            'utilisateur'
        );

        const conversationId = await findOrCreateConversation(
            firstUserId,
            secondUserId
        );

        const firstProductId = requiredMapValue(
            productIds,
            match.firstProductKey,
            'produit'
        );
        const secondProductId = requiredMapValue(
            productIds,
            match.secondProductKey,
            'produit'
        );

        await ensureMessage(
            conversationId,
            firstUserId,
            `Bonjour ! J’ai vu que nos articles se correspondent. Partant(e) pour en discuter ?`
        );

        await ensureMessage(
            conversationId,
            secondUserId,
            `Oui avec plaisir ! Je suis intéressé(e) par ton article #${firstProductId}, le mien est le #${secondProductId}.`
        );
    }
}

async function seedTrocs(
    userIds: Map<string, string>,
    productIds: Map<string, number>,
    matches: MatchPair[]
) {
    const trocMatches = matches.slice(0, Math.max(1, Math.ceil(matches.length / 2)));

    for (const [index, match] of trocMatches.entries()) {
        const initiatorId = requiredMapValue(
            userIds,
            match.firstUserKey,
            'utilisateur'
        );
        const receiverId = requiredMapValue(
            userIds,
            match.secondUserKey,
            'utilisateur'
        );

        await ensureTroc({
            initiatorId,
            receiverId,
            status: index % 2 === 0 ? 'accepted' : 'completed',
            deliveryMethod: 'in_person',
            meetingDate: index % 2 === 0
                ? '2026-09-20T14:00:00.000Z'
                : '2026-09-05T11:00:00.000Z',
            meetingDetails: index % 2 === 0
                ? 'Rendez-vous devant la gare principale.'
                : 'Échange réalisé au marché local.',
            completedAt: index % 2 === 0
                ? null
                : '2026-09-05T11:20:00.000Z',
            offeredProductId: requiredMapValue(
                productIds,
                match.firstProductKey,
                'produit'
            ),
            requestedProductId: requiredMapValue(
                productIds,
                match.secondProductKey,
                'produit'
            ),
        });
    }
}

async function findOrCreateConversation(
    firstUserId: string,
    secondUserId: string
): Promise<number> {
    const { data: links, error: linksError } = await admin
        .from('conversation_user')
        .select('id_conversation')
        .in('id_user', [firstUserId, secondUserId]);

    if (linksError) {
        throw new Error(`Recherche conversation impossible: ${linksError.message}`);
    }

    const candidateIds = [
        ...new Set((links ?? []).map((link) => link.id_conversation)),
    ];

    for (const conversationId of candidateIds) {
        const { data: members, error } = await admin
            .from('conversation_user')
            .select('id_user')
            .eq('id_conversation', conversationId);

        if (error) {
            throw new Error(`Lecture membres conversation impossible: ${error.message}`);
        }

        const memberIds = (members ?? []).map((member) => member.id_user);

        if (
            memberIds.length === 2 &&
            memberIds.includes(firstUserId) &&
            memberIds.includes(secondUserId)
        ) {
            return conversationId;
        }
    }

    const { data: conversation, error: createError } = await admin
        .from('conversation')
        .insert({ status: 'active' })
        .select('id')
        .single();

    if (createError || !conversation) {
        throw new Error(`Création conversation impossible: ${createError?.message}`);
    }

    const { error: membersError } = await admin
        .from('conversation_user')
        .insert([
            {
                id_user: firstUserId,
                id_conversation: conversation.id,
            },
            {
                id_user: secondUserId,
                id_conversation: conversation.id,
            },
        ]);

    if (membersError) {
        throw new Error(
            `Ajout membres conversation impossible: ${membersError.message}`
        );
    }

    return conversation.id;
}

async function ensureMessage(
    conversationId: number,
    senderId: string,
    content: string
) {
    const { data: existing, error: findError } = await admin
        .from('message')
        .select('id')
        .eq('id_conversation', conversationId)
        .eq('message_content', content)
        .maybeSingle();

    if (findError) {
        throw new Error(`Recherche message impossible: ${findError.message}`);
    }

    if (existing) {
        return;
    }

    const { error } = await admin
        .from('message')
        .insert({
            id_conversation: conversationId,
            id_sender: senderId,
            message_content: content,
            read_at: null,
        });

    if (error) {
        throw new Error(`Création message impossible: ${error.message}`);
    }
}

async function ensureTroc(input: {
    initiatorId: string;
    receiverId: string;
    status: 'accepted' | 'completed';
    deliveryMethod: 'in_person';
    meetingDate: string;
    meetingDetails: string;
    completedAt: string | null;
    offeredProductId: number;
    requestedProductId: number;
}) {
    const { data: existing, error: findError } = await admin
        .from('troc')
        .select('id')
        .eq('id_user_initiator', input.initiatorId)
        .eq('id_user_receiver', input.receiverId)
        .eq('status', input.status)
        .limit(1);

    if (findError) {
        throw new Error(`Recherche troc impossible: ${findError.message}`);
    }

    let trocId = existing?.[0]?.id;

    if (!trocId) {
        const { data, error } = await admin
            .from('troc')
            .insert({
                status: input.status,
                delivery_method: input.deliveryMethod,
                meeting_date: input.meetingDate,
                meeting_details: input.meetingDetails,
                completed_at: input.completedAt,
                needs_additional_trocoins: false,
                id_user_initiator: input.initiatorId,
                id_user_receiver: input.receiverId,
            })
            .select('id')
            .single();

        if (error || !data) {
            throw new Error(`Création troc impossible: ${error?.message}`);
        }

        trocId = data.id;
    }

    const { error: productsError } = await admin
        .from('troc_product')
        .upsert(
            [
                {
                    id_troc: trocId,
                    id_product: input.offeredProductId,
                    id_owner: input.initiatorId,
                    is_offered: true,
                },
                {
                    id_troc: trocId,
                    id_product: input.requestedProductId,
                    id_owner: input.receiverId,
                    is_offered: false,
                },
            ],
            {
                onConflict: 'id_product,id_troc',
            }
        );

    if (productsError) {
        throw new Error(
            `Association produits/troc impossible: ${productsError.message}`
        );
    }
}

async function findSeedProduct(
    name: string,
    ownerId: string
): Promise<{ id: number } | null> {
    const { data, error } = await admin
        .from('product')
        .select('id')
        .eq('name', name)
        .eq('id_user', ownerId)
        .limit(1);

    if (error) {
        throw new Error(`Recherche produit impossible: ${error.message}`);
    }

    return data?.[0] ?? null;
}

async function ensureProductPhoto(productId: number, photoPath: string) {
    const { data: existing, error: findError } = await admin
        .from('product_photos')
        .select('id')
        .eq('id_product', productId)
        .eq('url', photoPath)
        .maybeSingle();

    if (findError) {
        throw new Error(`Recherche photo impossible: ${findError.message}`);
    }

    if (existing) {
        return;
    }

    const { error } = await admin
        .from('product_photos')
        .insert({
            id_product: productId,
            url: photoPath,
            order_position: 1,
        });

    if (error) {
        throw new Error(`Création photo impossible: ${error.message}`);
    }
}

async function uploadRemoteImage(
    bucket: 'user-images' | 'product-images',
    path: string,
    remoteUrl: string
) {
    const response = await fetch(remoteUrl);

    if (!response.ok) {
        throw new Error(`Téléchargement image impossible: ${remoteUrl}`);
    }

    const bytes = await response.arrayBuffer();

    const { error } = await admin.storage
        .from(bucket)
        .upload(path, bytes, {
            upsert: true,
            contentType: response.headers.get('content-type') ?? 'image/jpeg',
            cacheControl: '31536000',
        });

    if (error) {
        throw new Error(`Upload Storage impossible: ${error.message}`);
    }
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
    let page = 1;

    while (true) {
        const { data, error } = await admin.auth.admin.listUsers({
            page,
            perPage: 1_000,
        });

        if (error) {
            throw new Error(`Lecture Auth impossible: ${error.message}`);
        }

        const user = data.users.find((candidate) => candidate.email === email);

        if (user) {
            return user.id;
        }

        if (data.users.length < 1_000) {
            return null;
        }

        page += 1;
    }
}

async function loadCategories(): Promise<Category[]> {
    const { data, error } = await admin
        .from('category')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('id');

    if (error) {
        throw new Error(`Lecture catégories impossible: ${error.message}`);
    }

    return data ?? [];
}

async function loadStates(): Promise<State[]> {
    const { data, error } = await admin
        .from('state')
        .select('id, name, slug')
        .order('id');

    if (error) {
        throw new Error(`Lecture états impossible: ${error.message}`);
    }

    return data ?? [];
}

async function loadExistingBrands(): Promise<Brand[]> {
    const { data, error } = await admin
        .from('brand')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('id');

    if (error) {
        throw new Error(`Lecture marques impossible: ${error.message}`);
    }

    return data ?? [];
}

function parseConfig(): SeedConfig {
    const users = readIntegerOption('users', 30);
    const minProducts = readIntegerOption('min-products', 3);
    const maxProducts = readIntegerOption('max-products', 8);
    const seed = readStringOption('seed', DEFAULT_SEED);

    if (users < 20 || users > 50) {
        throw new Error('--users doit être compris entre 20 et 50.');
    }

    if (minProducts < 3 || maxProducts > 8 || minProducts > maxProducts) {
        throw new Error(
            '--min-products et --max-products doivent être compris entre 3 et 8.'
        );
    }

    return {
        seed,
        users,
        minProducts,
        maxProducts,
    };
}

function readIntegerOption(name: string, fallback: number): number {
    const value = readStringOption(name, String(fallback));
    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
        throw new Error(`--${name} doit être un entier.`);
    }

    return parsed;
}

function readStringOption(name: string, fallback: string): string {
    const prefix = `--${name}=`;
    const argument = process.argv.find((value) => value.startsWith(prefix));

    return argument ? argument.slice(prefix.length).trim() : fallback;
}

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Variable d’environnement manquante : ${name}`);
    }

    return value;
}

function assertDevTarget(url: string) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Le seed est interdit avec NODE_ENV=production.');
    }

    if (process.env.SUPABASE_SEED_ENV !== 'development') {
        throw new Error(
            'Ajoute SUPABASE_SEED_ENV=development pour autoriser ce seed.'
        );
    }

    // if (EXPECTED_DEV_PROJECT_REF === 'REMPLACE_PAR_LE_PROJECT_REF_DEV') {
    //     throw new Error(
    //         'Renseigne EXPECTED_DEV_PROJECT_REF dans scripts/seed-dev.ts.'
    //     );
    // }

    const projectRef = new URL(url).hostname.split('.')[0];

    if (projectRef !== EXPECTED_DEV_PROJECT_REF) {
        throw new Error(
            `Projet refusé : "${projectRef}" ne correspond pas au projet DEV autorisé.`
        );
    }
}

function requiredMapValue<T>(
    map: Map<string, T>,
    key: string,
    label: string
): T {
    const value = map.get(key);

    if (value === undefined) {
        throw new Error(`${label} introuvable : ${key}`);
    }

    return value;
}

function normalizeUsername(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 30);
}

function normalizeSlug(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function deterministicUuid(value: string): string {
    const hex = [0, 1, 2, 3]
        .map((index) => hashString(`${value}:${index}`).toString(16).padStart(8, '0'))
        .join('');

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        `4${hex.slice(13, 16)}`,
        `8${hex.slice(17, 20)}`,
        hex.slice(20, 32),
    ].join('-');
}

function hashString(value: string): number {
    let hash = 2_166_136_261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16_777_619);
    }

    return hash >>> 0;
}

function createRng(seed: string) {
    let state = hashString(seed);

    const next = () => {
        state += 0x6d2b79f5;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

        return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
    };

    return {
        int(min: number, max: number) {
            return Math.floor(next() * (max - min + 1)) + min;
        },

        bool(probability = 0.5) {
            return next() < probability;
        },

        pick<T>(items: T[]): T {
            if (items.length === 0) {
                throw new Error('Impossible de choisir dans une liste vide.');
            }

            return items[Math.floor(next() * items.length)];
        },

        shuffle<T>(items: T[]): T[] {
            const copy = [...items];

            for (let index = copy.length - 1; index > 0; index -= 1) {
                const target = Math.floor(next() * (index + 1));
                [copy[index], copy[target]] = [copy[target], copy[index]];
            }

            return copy;
        },
    };
}

main().catch((error) => {
    console.error('\nSeed DEV échoué.');
    console.error(error);
    process.exitCode = 1;
});