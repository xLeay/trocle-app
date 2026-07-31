

import { NotificationItemData } from '@/src/types/notification';

// mock data
export const MOCK_NOTIFICATIONS: NotificationItemData[] = [
    {
        id: 1,
        type: 'feed_item_liked',
        user: {
            userName: 'Alice',
            userCertified: false,
            userAvatarSeed: 'alice',
        },
        itemName: 'Guinness world records',
        itemImage: 'https://picsum.photos/seed/troc1/200/200',
        timestamp: '2h',
    },
    {
        id: 2,
        type: 'troc_item_liked',
        user: {
            userName: 'Bob',
            userCertified: false,
            userAvatarSeed: 'bob',
        },
        itemName: 'Troc 2',
        itemImage: 'https://picsum.photos/seed/troc2/200/200',
        timestamp: '3h',
    },
    {
        id: 3,
        type: 'new_review',
        user: {
            userName: 'Charlie',
            userCertified: false,
            userAvatarSeed: 'charlie',
        },
        itemName: 'Troc 3',
        itemImage: 'https://picsum.photos/seed/troc3/200/200',
        timestamp: '4h',
    },
    {
        id: 4,
        type: 'new_follower',
        user: {
            userName: 'David',
            userCertified: true,
            certificationColor: 'brand',
            userAvatarSeed: 'david',
        },
        itemName: 'Troc 4',
        itemImage: 'https://picsum.photos/seed/troc4/200/200',
        timestamp: '5h',
    },
    {
        id: 5,
        type: 'troc_proposal_received',
        user: {
            userName: 'Eve',
            userCertified: false,
            userAvatarSeed: 'eve',
        },
        itemName: 'Troc 5',
        itemImage: 'https://picsum.photos/seed/troc5/200/200',
        timestamp: '6h',
    },
    {
        id: 6,
        type: 'troc_proposal_rejected',
        user: {
            userName: 'Frank',
            userCertified: false,
            userAvatarSeed: 'frank',
        },
        itemName: 'Troc 6',
        itemImage: 'https://picsum.photos/seed/troc6/200/200',
        timestamp: '7h',
    },
    {
        id: 7,
        type: 'report_acknowledged',
        user: {
            userName: 'Grace',
            userCertified: false,
            userAvatarSeed: 'grace',
        },
        itemName: 'Troc 7',
        itemImage: 'https://picsum.photos/seed/troc7/200/200',
        timestamp: '8h',
    },
    {
        id: 8,
        type: 'followed_user_new_post',
        user: {
            userName: 'Heidi',
            userCertified: false,
            userAvatarSeed: 'heidi',
        },
        itemName: 'Troc 8',
        itemImage: 'https://picsum.photos/seed/troc8/200/200',
        timestamp: '9h',
    },
];

