import { router } from 'expo-router';
import React, { useMemo } from 'react';

// HOOKS
import { useTheme } from '@/src/lib/hooks/useTheme';

// API
import { PrivateConversation } from '@/src/lib/api/messages';

// UTILS
import { CERTIFICATIONS } from '@/src/lib/utils/certification';

// COMPOSANTS BASIQUES 
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Table from '#/display/Table';

// ICÔNES
import { Newmessage } from '#/icons';


// Mock data
// import { ConversationMock, MOCK_CONVERSATIONS } from '@/src/mock/dms.mock';


export type SearchFilterType = 'all' | 'users' | 'messages';

interface PrivateMessagesListProps {
    search?: string;
    filterType?: SearchFilterType;
    conversations?: PrivateConversation[];
    onPressNewMessage?: () => void;
}

function formatConversationDate(date: string | null): string {
    if (!date) return '';

    const messageDate = new Date(date);
    const now = new Date();
    const differenceMs = now.getTime() - messageDate.getTime();
    const differenceHours = Math.floor(differenceMs / (1000 * 60 * 60));
    const isToday = messageDate.toDateString() === now.toDateString();

    if (differenceHours < 1) return 'À l’instant';
    if (differenceHours < 24 && isToday) return `${differenceHours} h`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Hier';
    }

    return messageDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
    });
}

const PrivateMessagesList: React.FC<PrivateMessagesListProps> = ({
    search = '',
    filterType = 'all',
    conversations = [],
    onPressNewMessage,
}) => {

    const { activeTheme } = useTheme();

    // Filtrage de la liste
    const filteredConversations = useMemo(() => {
        if (!search.trim()) return conversations;

        const query = search.toLowerCase().trim();

        return conversations.filter((item) => {
            const matchesName = item.name.toLowerCase().includes(query);
            const matchesMessage = item.lastMessage.toLowerCase().includes(query);

            if (filterType === 'users') return matchesName;
            if (filterType === 'messages') return matchesMessage;

            return matchesName || matchesMessage;
        });
    }, [conversations, filterType, search]);


    const getCertificationColor = (slug: string | null) => {
        if (!slug || !(slug in CERTIFICATIONS)) {
            return activeTheme.colors.icon.brand;
        }

        const certification = CERTIFICATIONS[slug as keyof typeof CERTIFICATIONS];

        if (!certification.color) {
            return activeTheme.colors.icon.brand;
        }

        return activeTheme.colors.icon[
            certification.color as keyof typeof activeTheme.colors.icon
        ];
    };

    return (
        <Flex style={{ flex: 1, width: '100%', paddingVertical: activeTheme.spacing._100 }}>
            {filteredConversations.length === 0 ? (
                /* Pas de résultat */
                <Flex alignItems="center" justifyContent="center" style={{ flex: 1, padding: activeTheme.spacing._200 }}>
                    <Text type="secondary" variant="body_Medium">
                        {search ? `Aucun message trouvé pour "${search}"` : 'Aucun message pour le moment'}
                    </Text>
                </Flex>
            ) : (
                /* Liste des conversations */
                <Flex scroll gap={activeTheme.spacing._200} style={{ width: '100%' }}>
                    {filteredConversations.map((item) => (
                        <Table
                            key={item.id}
                            onPress={() => router.push(`/(protected)/chat/${item.id}`)}
                            leftProps={{
                                variant: 'avatar',
                                onAvatarPress: () => router.push(`/user/${item.name}`),
                                avatarSize: 'large',
                                leftText: item.name,
                                legendText: item.lastMessage,
                                numberOfLines: 1,
                                read: item.read,
                                searchQuery: search,
                                certified: Boolean(
                                    item.certificationSlug && item.certificationSlug in CERTIFICATIONS
                                ),
                                certificationColor: getCertificationColor(item.certificationSlug),
                                src: item.profilePicture ?? undefined,
                            }}
                            rightProps={{
                                variant: 'timestamp',
                                read: item.read,
                                timestampText: formatConversationDate(item.lastMessageSentAt),
                            }}
                        />
                    ))}
                </Flex>
            )}
            {/* FAB Nouveau DM */}
            <Flex
                style={{
                    position: 'absolute',
                    bottom: activeTheme.spacing._200,
                    right: activeTheme.spacing._200
                }}
            >
                <Button
                    variant="primary"
                    size="FAB"
                    icon={<Newmessage filled size={36} />}
                    onPress={onPressNewMessage}
                />
            </Flex>
        </Flex>
    );
};

export default PrivateMessagesList;