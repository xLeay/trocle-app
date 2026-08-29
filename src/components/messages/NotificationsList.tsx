import React from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';


import NotificationRow from './NotificationRow';

import { Follow, Heart, Plus, Shield, Star1, Troc } from '#/icons';

import { NotificationItemData } from '@/src/types/notification';

interface NotificationsListProps {
    notifications: NotificationItemData[];
}

const avatarImage = require('@/assets/avatar_1.png');

const NotificationsList: React.FC<NotificationsListProps> = ({
    notifications,
}) => {

    const { activeTheme } = useTheme();

    const getNotificationItem = (notification: NotificationItemData) => {
        switch (notification.type) {
            case 'feed_item_liked':
                return {
                    left: <Heart filled color={activeTheme.colors.icon.danger} size={32} />,
                    title: 'a mis en favoris un de tes articles',
                    avatar: <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="small" />,
                    user: notification.user,
                    itemImage: notification.itemImage,
                    itemName: notification.itemName,
                };
            case 'troc_item_liked':
                return {
                    left: (
                        <Flex borderColor={activeTheme.colors.icon.danger} style={{ position: 'relative' }}>
                            <Avatar touchable={false} blurred={2} customImage={avatarImage} size="medium" />
                            <Flex alignItems='center' justifyContent='center' style={{ backgroundColor: activeTheme.colors.surface.primary, width: 24, height: 24, borderRadius: activeTheme.radius.full, position: 'absolute', right: 0, bottom: -8 }}>
                                <Heart filled gradient={activeTheme.colors.gradient.primaryGradient} size={16} />
                            </Flex>
                        </Flex>
                    ),
                    title: 'Un utilisateur a aimé un de tes articles dans l’onglet Troc',
                    actionLink: `Lien vers la notification' : `
                };
            case 'new_review':
                return {
                    left: <Star1 color={activeTheme.colors.icon.yellow} size={32} />,
                    title: 'a laissé une note et un avis sur ton compte',
                    avatar: <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="small" />,
                    user: notification.user,
                };
            case 'new_follower':
                return {
                    left: <Follow filled color={activeTheme.colors.icon.blue} size={32} />,
                    title: 'a commencé à te suivre',
                    avatar: <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="small" />,
                    user: notification.user,
                };
            case 'troc_proposal_received':
                return {
                    left: <Troc filled color={activeTheme.colors.icon.brand} size={32} />,
                    title: 'te propose un Troc',
                    avatar: <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="small" />,
                    user: notification.user,
                    itemImage: notification.itemImage,
                    itemName: notification.itemName,
                };
            case 'troc_proposal_rejected':
                return {
                    left: <Troc filled color={activeTheme.colors.icon.danger} size={32} />,
                    title: 'a refusé la proposition Troc',
                    avatar: <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="small" />,
                    user: notification.user,
                    itemImage: notification.itemImage,
                    itemName: notification.itemName,
                };
            case 'report_acknowledged':
                return {
                    left: <Shield filled color={activeTheme.colors.icon.blue} size={32} />,
                    title: 'Ton signalement a bien été pris en compte.',
                };
            case 'followed_user_new_post':
                return {
                    left: (
                        <Flex borderColor={activeTheme.colors.icon.danger} style={{ position: 'relative' }}>
                            <Avatar customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${notification.user.userAvatarSeed}`} size="medium" />
                            <Flex alignItems='center' justifyContent='center' style={{ backgroundColor: activeTheme.colors.surface.primary, width: 24, height: 24, borderRadius: activeTheme.radius.full, position: 'absolute', right: 0, bottom: -8 }}>
                                <Plus color={activeTheme.colors.icon.blue} size={16} />
                            </Flex>
                        </Flex>
                    ),
                    user: notification.user,
                    title: 'a récemment ajouté un nouvel article sur Trocle',
                    actionLink: `Lien vers la notification' : `
                };
        }
    }

    return (
        <Flex gap={activeTheme.spacing._200} style={{ flex: 1, width: '100%', marginTop: activeTheme.spacing._100 }}>
            <Flex scroll gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                {notifications.map((notification, index) => {
                    const config = getNotificationItem(notification);
                    return (
                        <React.Fragment key={notification.id}>
                            <NotificationRow
                                left={config.left}
                                title={config.title}
                                avatar={config.avatar}
                                user={config.user}
                                itemImage={config.itemImage}
                                itemName={config.itemName}
                                timestamp={notification.timestamp}
                                actionLink={config.actionLink}
                            />

                            {index !== notifications.length - 1 && <Divider padding />}
                        </React.Fragment>
                    );
                })}
                <Flex style={{ height: activeTheme.spacing._200 }} />
            </Flex>
        </Flex>
    );
};

export default NotificationsList;