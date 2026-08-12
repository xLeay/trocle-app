export interface FollowingMock {
    id: string;
    username: string;
    avatarSeed: string;
    certified?: boolean;
    certificationColor?: string;
    isFollowedByYou?: boolean;
}

export const MOCK_FOLLOWS: FollowingMock[] = [
    {
        id: '1',
        username: 'Shuri',
        avatarSeed: 'shuri',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '3',
        username: 'Équipe Trocle',
        avatarSeed: 'trocle',
        certified: true,
        certificationColor: 'accent',
        isFollowedByYou: true,
    },
    {
        id: '5',
        username: 'Nox',
        avatarSeed: 'nox',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '6',
        username: 'Maya',
        avatarSeed: 'maya',
        certified: false,
        isFollowedByYou: true,
    },
    {
        id: '7',
        username: 'Kiro',
        avatarSeed: 'kiro',
        certified: false,
        isFollowedByYou: true,
    },
    {
        id: '10',
        username: 'Aya',
        avatarSeed: 'aya',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '12',
        username: 'Milo',
        avatarSeed: 'milo',
        certified: false,
        isFollowedByYou: true,
    },
    {
        id: '13',
        username: 'Yuna',
        avatarSeed: 'yuna',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '16',
        username: 'Orion',
        avatarSeed: 'orion',
        certified: false,
        isFollowedByYou: true,
    },
    {
        id: '17',
        username: 'Nina',
        avatarSeed: 'nina',
        certified: false,
        isFollowedByYou: true,
    },
    {
        id: '18',
        username: 'Zéphyr',
        avatarSeed: 'zephyr',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '20',
        username: 'Mina',
        avatarSeed: 'mina',
        certified: true,
        certificationColor: 'brand',
        isFollowedByYou: true,
    },
    {
        id: '21',
        username: 'Axel',
        avatarSeed: 'axel',
        certified: false,
        isFollowedByYou: true,
    },
];
