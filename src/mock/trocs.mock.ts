export interface TrocMock {
    id: string;
    id_initiator_article: string;
    id_recipient_article: string;
    title_initiator_article: string;
    title_recipient_article: string;
    image_initiator_article: string;
    image_recipient_article: string;
    username_initiator: string;
    username_recipient: string;
    location_troc: string;
    troc_date: Date;
    troc_time: Date;
    created_at: Date;
    troc_delivery_method: "hand_delivery" | "parcel_delivery";
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
}

export const MOCK_TROCS: TrocMock[] = [
    {
        id: '1',
        id_initiator_article: '101',
        id_recipient_article: '102',
        title_initiator_article: 'PS5',
        title_recipient_article: 'PC Retro',
        image_initiator_article: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80', // PS5
        image_recipient_article: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', // PC Retro
        username_initiator: 'xLeay',
        username_recipient: 'Shuri',
        location_troc: '61-65 Av. de la Victoire, 77100, Meaux',
        troc_date: new Date('2026-09-02'),
        troc_time: new Date('2026-09-02T14:30:00'),
        created_at: new Date('2026-08-02'),
        troc_delivery_method: 'hand_delivery',
        status: 'accepted',
    },
    {
        id: '2',
        id_initiator_article: '103',
        id_recipient_article: '104',
        title_initiator_article: 'Vélo',
        title_recipient_article: 'Appareil photo',
        image_initiator_article: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80', // Vélo
        image_recipient_article: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80', // Appareil photo
        username_initiator: 'Dodo',
        username_recipient: 'xLeay',
        location_troc: '14 Rue de la République, 69002, Lyon',
        troc_date: new Date('2026-09-05'),
        troc_time: new Date('2026-09-05T10:00:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'hand_delivery',
        status: 'accepted',
    },
    {
        id: '3',
        id_initiator_article: '105',
        id_recipient_article: '106',
        title_initiator_article: 'Sneakers',
        title_recipient_article: 'Montre',
        image_initiator_article: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', // Sneakers
        image_recipient_article: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', // Montre
        username_initiator: 'xLeay',
        username_recipient: 'Alex',
        location_troc: '85 Rue Sainte-Catherine, 33000, Bordeaux',
        troc_date: new Date('2026-09-10'),
        troc_time: new Date('2026-09-10T16:15:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'parcel_delivery',
        status: 'accepted',
    },
    {
        id: '4',
        id_initiator_article: '107',
        id_recipient_article: '108',
        title_initiator_article: 'Smartphone',
        title_recipient_article: 'Casque audio',
        image_initiator_article: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', // Smartphone
        image_recipient_article: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', // Casque audio
        username_initiator: 'Sarah',
        username_recipient: 'xLeay',
        location_troc: '12 Place de la Bastille, 75011, Paris',
        troc_date: new Date('2026-08-30'),
        troc_time: new Date('2026-08-30T18:00:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'hand_delivery',
        status: 'pending',
    },
    {
        id: '5',
        id_initiator_article: '109',
        id_recipient_article: '110',
        title_initiator_article: 'Veste cuir',
        title_recipient_article: 'Smartwatch',
        image_initiator_article: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=600&q=80', // Veste cuir
        image_recipient_article: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', // Smartwatch
        username_initiator: 'xLeay',
        username_recipient: 'Marc',
        location_troc: '34 La Canebière, 13001, Marseille',
        troc_date: new Date('2026-09-01'),
        troc_time: new Date('2026-09-01T11:45:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'parcel_delivery',
        status: 'pending',
    },
    {
        id: '6',
        id_initiator_article: '111',
        id_recipient_article: '112',
        title_initiator_article: 'Clavier',
        title_recipient_article: 'Écran',
        image_initiator_article: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80', // Clavier
        image_recipient_article: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', // Écran
        username_initiator: 'Lucas',
        username_recipient: 'xLeay',
        location_troc: '5 Rue Faidherbe, 59800, Lille',
        troc_date: new Date('2026-08-15'),
        troc_time: new Date('2026-08-15T15:00:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'parcel_delivery',
        status: 'completed',
    },
    {
        id: '7',
        id_initiator_article: '113',
        id_recipient_article: '114',
        title_initiator_article: 'Laptop',
        title_recipient_article: 'Tablette',
        image_initiator_article: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80', // Laptop
        image_recipient_article: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&q=80', // Tablette
        username_initiator: 'xLeay',
        username_recipient: 'Emma',
        location_troc: '18 Rue Crébillon, 44000, Nantes',
        troc_date: new Date('2026-08-20'),
        troc_time: new Date('2026-08-20T17:30:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'hand_delivery',
        status: 'rejected',
    },
    {
        id: '8',
        id_initiator_article: '115',
        id_recipient_article: '116',
        title_initiator_article: 'Sac',
        title_recipient_article: 'Parfum',
        image_initiator_article: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', // Sac
        image_recipient_article: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80', // Parfum
        username_initiator: 'Chloe',
        username_recipient: 'xLeay',
        location_troc: '22 Rue Alsace Lorraine, 31000, Toulouse',
        troc_date: new Date('2026-08-25'),
        troc_time: new Date('2026-08-25T13:00:00'),
        created_at: new Date('2026-08-01'),
        troc_delivery_method: 'hand_delivery',
        status: 'cancelled',
    },
];