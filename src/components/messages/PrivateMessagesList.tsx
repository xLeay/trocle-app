import React, { useMemo } from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Table from '#/display/Table';

import { Newmessage } from '#/icons';

// Mock data
import { ConversationMock, MOCK_CONVERSATIONS } from '@/src/mock/dms.mock';

export type SearchFilterType = 'all' | 'users' | 'messages';

interface PrivateMessagesListProps {
    search?: string;
    filterType?: SearchFilterType;
    conversations?: ConversationMock[];
    onPressConversation?: (conversation: ConversationMock) => void;
    onPressNewMessage?: () => void;
}

const PrivateMessagesList: React.FC<PrivateMessagesListProps> = ({
    search = '',
    filterType = 'all',
    conversations = MOCK_CONVERSATIONS,
    onPressConversation,
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

            return matchesName || matchesMessage; // 'all'
        });
    }, [search, filterType, conversations]);


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
                            onPress={() => onPressConversation?.(item)}
                            leftProps={{
                                variant: 'avatar',
                                avatarSize: 'large',
                                leftText: item.name,
                                legendText: item.lastMessage,
                                numberOfLines: 1,
                                read: item.read,
                                searchQuery: search,
                                certified: item.certified,
                                certificationColor: activeTheme.colors.icon[item.certificationColor as keyof typeof activeTheme.colors.icon] ?? activeTheme.colors.icon.brand,
                                src: `https://api.dicebear.com/10.x/dylan/svg?seed=${item.avatarSeed}`,
                            }}
                            rightProps={{
                                variant: 'timestamp',
                                read: item.read,
                                timestampText: item.timestamp,
                            }}
                        />
                    ))}
                </Flex>
            )}
            {/* FAB Nouveau DM */}
            <Flex style={{ position: 'absolute', bottom: activeTheme.spacing._200, right: activeTheme.spacing._200 }}>
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