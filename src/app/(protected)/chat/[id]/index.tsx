import { FlashList } from '@shopify/flash-list';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// HOOKS
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

// UTILS
import { CERTIFICATIONS } from '@/src/lib/utils/certification';

// API
import { ConversationMessage } from '@/src/lib/api/messages';

// STATE
import { useAuthStore } from '@/src/state/authStore';

// QUERIES
import {
    useConversationContext,
    useConversationMessages,
    useSendConversationMessage
} from '@/src/queries/useConversationMessages';

// COMPOSANTS BASIQUES
import Flex from '#/Flex';
import Text from '#/Text';
import MessageBar from '#/bars/MessageBar';
import Button from '#/controls/Button';
import PressableOverlay from '#/controls/PressableOverlay';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio from '#/display/ImageRatio';
import MessageBubble from '#/display/MessageBubble';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// COMPOSANTS METIER
import PropositionMessage from '#/chat/PropositionMessage';

// ICÔNES
import { Certification, Star1, Troc } from '#/icons';


export default function ChatScreen() {
    const { activeTheme } = useTheme();

    const insets = useSafeAreaInsets();
    const offset = {
        closed: 0,
        opened: insets.bottom
    };

    const { id } = useLocalSearchParams<{ id: string }>();

    const currentUserId = useAuthStore((state) => state.user?.id);
    const myUsername = useAuthStore((state) => state.profile?.username);

    const {
        data: messages = [],
        isLoading: isLoadingMessages,
    } = useConversationMessages(id);

    const sendMessage = useSendConversationMessage(id, currentUserId);


    const { data: conversationContext } = useConversationContext(id);

    const recipientName = conversationContext?.otherUsername ?? 'Utilisateur';
    const recipientProfilePicture = conversationContext?.otherProfilePicture ?? undefined;
    const isRecipientCertified = Boolean(conversationContext?.certificationSlug);





    const getCertificationColor = (slug: string | null | undefined) => {
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


    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar("_small+table", {
        // canGoBack: boolean, onBack: function, iconColor: string, tableLeft: TableLeftProps, tableRight: TableRightProps
        canGoBack,
        onBack,
        iconColor: activeTheme.colors.component.button.secondary,
        tableLeft: {
            variant: 'avatar',
            avatarSize: 'medium',
            src: recipientProfilePicture,
            leftText: recipientName,
            certified: isRecipientCertified,
            certificationColor: getCertificationColor(conversationContext?.certificationSlug),
            numberOfLines: 1,
        },
        tableRight: {
            variant: 'button',
            button: (
                <Button
                    label="Troc"
                    variant="outlined"
                    size="small"
                    icon={<Troc filled size={24} color={activeTheme.colors.surface.contrast} />}
                    iconPosition='right'
                    onPress={() => router.push({
                        pathname: `/(protected)/trocs/proposition`,
                        params: {
                            id_conversation: id,
                            username: recipientName,
                            profile_picture: recipientProfilePicture,
                            certified: String(isRecipientCertified),
                            certificationColor: getCertificationColor(conversationContext?.certificationSlug),
                        }
                    })} />
            ),
        },
        onPress: () => router.push({
            pathname: `/(protected)/chat/${id}/details`,
            params: {
                username: recipientName,
                profile_picture: recipientProfilePicture,
                certified: String(isRecipientCertified),
                certificationColor: getCertificationColor(conversationContext?.certificationSlug),
            }
        }),
    });

    const presentation = {
        id: conversationContext?.otherUserId ?? '',
        username: recipientName,
        profile_picture: recipientProfilePicture,
        bio: conversationContext?.otherBio ?? '',
    };

    const MONTHS_FR = [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];

    const formatDateSeparator = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        // Si c'est aujourd'hui, on affiche l'heure "11:15"
        if (isToday) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }

        // Sinon, on affiche "1er janv. 2026" ou "15 mars 2026"
        const day = date.getDate();
        const dayStr = day === 1 ? '1er' : `${day}`;
        const monthStr = MONTHS_FR[date.getMonth()];
        const year = date.getFullYear();

        return `${dayStr} ${monthStr} ${year}`;
    };

    const shouldShowHeader = (
        currentMsg: ConversationMessage,
        prevMsg?: ConversationMessage
    ) => {
        if (!prevMsg) return true;
        const currentTime = new Date(currentMsg.sent_at).getTime();
        const prevTime = new Date(prevMsg.sent_at).getTime();
        const diffInMinutes = (currentTime - prevTime) / (1000 * 60);

        return diffInMinutes > 30; // true si plus de 30 min d'écart
    };

    const reversedMessages = React.useMemo(() => [...messages].reverse(), [messages]);

    const [inputText, setInputText] = useState('');

    const handleSend = (content: string) => {
        const trimmedContent = content.trim();

        if (!trimmedContent || sendMessage.isPending) {
            return;
        }

        sendMessage.mutate(trimmedContent, {
            onSuccess: () => {
                setInputText('');
            },
        });
    };


    if (isLoadingMessages) {
        return null;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />
            <KeyboardStickyView
                offset={offset}
                style={{
                    flex: 1,
                    // borderWidth: 1,
                    // borderColor: 'blue'
                }}
            >
                <Flex style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary }}>
                    <FlashList
                        inverted
                        ListFooterComponent={(
                            <Flex alignItems='center' justifyContent='center' gap={activeTheme.spacing._400}>
                                <Flex justifyContent='center' alignItems='center' gap={activeTheme.spacing._100}>
                                    <PressableOverlay
                                        overlayScale={1.1}
                                        borderRadius={activeTheme.radius.card}
                                        onPress={() => router.push(`/(protected)/user/${presentation?.username}`)}
                                    >
                                        <Flex justifyContent='center' alignItems='center' gap={activeTheme.spacing._100}>
                                            <Avatar size='veryLarge' customImage={presentation?.profile_picture} touchable={false} />

                                            <Flex gap={activeTheme.spacing._0} justifyContent='center' alignItems='center'>
                                                <Flex direction='row' alignItems='center' gap={activeTheme.spacing._0}>
                                                    <Text variant='body_Large'>{presentation?.username}</Text>
                                                    <Certification size={24} filled color={activeTheme.colors.icon.brand} />
                                                </Flex>
                                                <Flex gap={activeTheme.spacing._50} direction='row' justifyContent='center' alignItems='center'>
                                                    <Flex direction='row' gap={activeTheme.spacing._0}>
                                                        <Text variant='body_Small'>4,3</Text>
                                                        <Star1 size={16} color={activeTheme.colors.text.primary} />
                                                    </Flex>
                                                    <Text variant='body_Small'>(48)</Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </PressableOverlay>

                                    <Text
                                        variant='body_Large'
                                        style={{ textAlign: 'center' }}
                                    >
                                        {presentation?.bio}
                                    </Text>

                                    <Flex direction='row' justifyContent='center' alignItems='center' gap={activeTheme.spacing._50}>
                                        <Text variant='body_Medium' type='secondary'>18 abonnés</Text>
                                        <Flex style={{ width: 4, height: 4, backgroundColor: activeTheme.colors.text.secondary, borderRadius: 4 }}></Flex>
                                        <Text variant='body_Medium' type='secondary'>8 trocs</Text>
                                    </Flex>
                                </Flex>

                                <Divider />
                            </Flex>
                        )}
                        data={reversedMessages}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ width: '100%' }}
                        contentContainerStyle={{ padding: activeTheme.spacing._200, gap: activeTheme.spacing._0, width: '100%' }}

                        renderItem={({ item, index }) => {

                            const isMe = item.id_sender === currentUserId;
                            const previousMessage = reversedMessages[index + 1]; // Message précédent dans le temps (au-dessus)
                            const isLatest = index === 0 || reversedMessages[index - 1].id_sender !== item.id_sender;

                            const isRead = item.read_at !== null && item.read_at !== undefined;
                            const messageLabelType = (isMe && index === 0)
                                ? (isRead ? 'read' : 'sent')
                                : 'hour';

                            const formattedTime = new Date(item.sent_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            });


                            const showDateSeparator = !previousMessage || shouldShowHeader(item, previousMessage);

                            const getMarginTop = () => {
                                if (showDateSeparator) return activeTheme.spacing._400; // Après une date
                                if (!previousMessage) return 0;
                                if (previousMessage.id_sender !== item.id_sender) return activeTheme.spacing._200; // Entre 2 personnes
                                return activeTheme.spacing._100; // Dans une streak
                            };

                            // On récupère le message auquel on répond
                            const repliedMessage = item.reply_to_id_message
                                ? messages.find((m) => m.id === item.reply_to_id_message)
                                : null;
                            // Nom de la personne à qui on répond ("toi" ou "recipientName")
                            const repliedSenderName = repliedMessage
                                ? (repliedMessage.id_sender === currentUserId ? 'moi' : recipientName)
                                : '';

                            return (
                                <Flex
                                    // border
                                    // borderColor='blue'
                                    direction="column"
                                    alignItems='stretch'
                                    gap={activeTheme.spacing._200}
                                    style={{ width: '100%', marginTop: getMarginTop() }}
                                >
                                    {/* Séparateur de date / heure au milieu */}
                                    {showDateSeparator && (
                                        <Flex
                                            // border
                                            // borderColor='red'
                                            fullWidth
                                            alignItems="center"
                                            justifyContent="center"
                                            style={{ marginBottom: activeTheme.spacing._100 }}
                                        >
                                            <Text variant="body_Small" type="secondary">
                                                {formatDateSeparator(item.sent_at)}
                                            </Text>
                                        </Flex>
                                    )}

                                    {(() => {

                                        switch (item.message_type) {
                                            case 'troc_proposal':
                                                return (
                                                    <PropositionMessage
                                                        type={isMe ? 'me' : 'someone_else'}
                                                        // type='someone_else'
                                                        // status={'pending'}
                                                        status={'accepted'}
                                                        // status={'rejected'}
                                                        latest={isLatest}
                                                        label={formattedTime}
                                                        messageLabelType={messageLabelType}
                                                        myUsername={myUsername}
                                                        otherUsername={recipientName}
                                                        onPress={() => {
                                                            router.push(`/(protected)/trocs/${item.id_troc}/troc-details`)
                                                        }}
                                                    />
                                                );
                                            case 'text':
                                            default:
                                                return (
                                                    <>
                                                        {Boolean(repliedMessage) && (
                                                            <MessageBubble
                                                                content={repliedMessage?.message_content}
                                                                isReply
                                                                type={isMe ? 'me' : 'someone_else'}
                                                                label={`En réponse à ${repliedSenderName}`}
                                                                messageLabelType="hour"
                                                                latest
                                                            />
                                                        )}

                                                        {Boolean(item.attachments && item.attachments.length > 0) && (
                                                            <Flex direction="row" style={{ width: 150, marginBottom: -activeTheme.spacing._100 }}>
                                                                {item.attachments?.map((attachment) => (
                                                                    <ImageRatio
                                                                        key={attachment.id}
                                                                        ratio="2:3"
                                                                        source={{ uri: attachment.file_path }}
                                                                        style={{ borderRadius: activeTheme.radius.card }}
                                                                    />
                                                                ))}
                                                            </Flex>
                                                        )}

                                                        <MessageBubble
                                                            content={item.message_content}
                                                            type={isMe ? 'me' : 'someone_else'}
                                                            latest={isLatest}
                                                            label={formattedTime}
                                                            messageLabelType={messageLabelType}
                                                        />
                                                    </>
                                                );
                                        }
                                    })()}
                                </Flex>
                            );
                        }}
                    />

                    {/* Zone de saisie */}

                    <Flex fullWidth style={{ padding: activeTheme.spacing._100, borderTopWidth: 1, borderColor: activeTheme.colors.surface.divider }}>
                        <MessageBar
                            placeholder='Écris ton message'
                            value={inputText}
                            onChangeText={setInputText}
                            onImagePress={() => {
                                console.log('Ouvrir la galerie');
                            }}
                            onSend={(text) => {
                                console.log('Message envoyé :', text);
                                handleSend(text)
                            }}
                        />
                    </Flex>
                </Flex>

            </KeyboardStickyView>
        </>
    );
}
