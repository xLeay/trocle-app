
export type NotificationType =
    | 'feed_item_liked'
    | 'troc_item_liked'
    | 'new_review'
    | 'new_follower'
    | 'troc_proposal_received'
    | 'troc_proposal_rejected'
    | 'report_acknowledged'
    | 'followed_user_new_post';

export interface NotificationUser {
    userName: string;
    userCertified: boolean;
    certificationColor?: string;
    userAvatarSeed?: string;
}

export interface NotificationItemData {
    id: number;
    type: NotificationType;
    user: NotificationUser;
    itemName: string;
    itemImage?: string;
    timestamp: string;
}
