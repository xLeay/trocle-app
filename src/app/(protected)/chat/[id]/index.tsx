import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import MessageBar from '#/bars/MessageBar';
import Button from '#/controls/Button';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio from '#/display/ImageRatio';
import MessageBubble from '#/display/MessageBubble';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Certification, Star1, Troc } from '#/icons';

import { MOCK_CONVERSATIONS } from '@/src/mock/dms.mock';
import { User } from '@/src/types/user';


export interface MessageAttachment {
    id: number;
    created_at: string;
    file_path: string;            // URL de l'image (Supabase Storage URL)
    file_type: string;            // ex: 'image/jpeg'
    file_size?: number;
    id_message: number;
}

export interface Message {
    id: number;           // int8 dans Supabase
    message_content: string;       // text dans Supabase
    sent_at: string;              // timestamptz (ex: "2026-08-08T15:08:00Z")
    read_at?: string | null;       // timetz / timestamptz (null si non lu)
    has_attachment?: boolean;      // bool
    attachments?: MessageAttachment[]; // Joindre les pièces jointes
    reply_to_id_message?: number | null; // int8
    id_conversation: number;       // int8
    id_sender: string;             // uuid de l'expéditeur
}

export default function ChatScreen() {
    const { activeTheme } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();

    const insets = useSafeAreaInsets();
    const offset = {
        closed: 0,
        opened: insets.bottom
    };

    const conversation = MOCK_CONVERSATIONS.find((item) => item.id === id);
    const recipientName = conversation ? conversation.name : `Utilisateur #${id}`;


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
            src: `https://api.dicebear.com/10.x/dylan/svg?seed=${conversation?.avatarSeed}`,
            leftText: recipientName,
            certified: conversation?.certified ?? false,
            certificationColor: activeTheme.colors.icon[conversation?.certificationColor as keyof typeof activeTheme.colors.icon ?? 'brand'],
            numberOfLines: 1,
        },
        tableRight: {
            variant: 'button',
            button: (
                <Button label="Troc" variant="outlined" size="small" icon={<Troc filled size={24} color={activeTheme.colors.surface.contrast} />} iconPosition='right' onPress={() => console.log('Proposer le Troc à ' + recipientName)} />
            ),
        },
        onPress: () => router.push({
            pathname: `/(protected)/chat/${id}/details`,
            params: {
                id: conversation?.id,
                username: conversation?.name,
                profile_picture: conversation?.avatarSeed,
                certified: conversation?.certified ? 'true' : 'false',
                certificationColor: conversation?.certificationColor,
            }
        }),
    });


    const currentUserId = 'user_me';
    const otherUserId = 'user_other';

    const [presentation, setPresentation] = useState<User>({
        id: otherUserId,
        created_at: new Date().toISOString(),
        username: recipientName,
        profile_picture: `https://api.dicebear.com/10.x/dylan/svg?seed=${conversation?.avatarSeed}`,
        trocoin_balance: 5,
        bio: "Le goat de l'aviron"
    })

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            message_content: 'Salut ! Ton offre de troc pour la guitare est toujours disponible ?',
            sent_at: '2026-07-08T09:15:00Z',
            read_at: '2026-08-08T09:16:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        {
            id: 2,
            message_content: 'Oui tout à fait ! Tu proposais ton clavier maître en échange c\'est ça ?',
            sent_at: '2026-08-08T09:18:00Z',
            read_at: '2026-08-08T09:20:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 3,
            message_content: 'Exactement ! Un Akai MPK Mini en parfait état.',
            sent_at: '2026-08-08T09:22:00Z',
            read_at: '2026-08-08T09:23:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        {
            id: 4,
            message_content: 'Je peux t\'envoyer des photos si tu veux.',
            sent_at: '2026-08-08T09:23:30Z',
            read_at: '2026-08-08T09:25:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        // Pause de +30 min -> séparateur au centre
        {
            id: 5,
            message_content: 'Carrément, je veux bien des photos !',
            sent_at: '2026-08-08T10:15:00Z',
            read_at: '2026-08-08T10:16:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 6,
            message_content: 'Et de mon côté la guitare est une Fender Squier, comme neuve.',
            sent_at: '2026-08-08T10:16:30Z',
            read_at: '2026-08-08T10:17:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 7,
            message_content: 'Top ! Voilà la photo du clavier.',
            sent_at: '2026-08-08T10:20:00Z',
            read_at: '2026-08-08T10:22:00Z',
            has_attachment: true,
            attachments: [
                {
                    id: 101,
                    created_at: '2026-08-08T10:20:00Z',
                    file_path: 'https://i.imgur.com/p5NdI6n.jpeg',
                    file_type: 'image/jpeg',
                    file_size: 102400,
                    id_message: 7,
                }
            ],
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        {
            id: 8,
            message_content: 'Il est fourni avec la boîte d\'origine et le câble USB.',
            sent_at: '2026-08-08T10:21:00Z',
            read_at: '2026-08-08T10:22:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        // Autre pause de +30 min -> séparateur au centre
        {
            id: 9,
            message_content: 'Franchement il a l\'air en super état !',
            sent_at: '2026-08-08T14:00:00Z',
            read_at: '2026-08-08T14:05:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 10,
            message_content: 'On peut se capter en main propre pour faire l\'échange ?',
            sent_at: '2026-08-08T14:01:00Z',
            read_at: '2026-08-08T14:05:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 11,
            message_content: 'Carrément ! Tu es dans quel quartier ?',
            sent_at: '2026-08-08T14:10:00Z',
            read_at: '2026-08-08T14:12:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        {
            id: 12,
            message_content: 'Je suis vers République, et toi ?',
            sent_at: '2026-08-08T14:15:00Z',
            read_at: '2026-08-08T14:16:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 13,
            message_content: 'Pas loin du tout, je suis vers Bastille !',
            sent_at: '2026-08-08T14:18:00Z',
            read_at: '2026-08-08T14:20:00Z',
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: otherUserId,
        },
        {
            id: 14,
            message_content: 'Super, tu serais dispo demain dans l\'après-midi ?',
            sent_at: '2026-08-08T14:20:00Z',
            read_at: '2026-08-08T14:22:00Z',
            has_attachment: false,
            reply_to_id_message: 13,
            id_conversation: 1,
            id_sender: currentUserId,
        },
        {
            id: 15,
            message_content: 'À partir de 15h je dirais !',
            sent_at: '2026-08-08T14:22:00Z',
            read_at: '2026-08-08T14:23:00Z', // Mettre `null` si tu veux tester l'état "Sent" non lu
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: currentUserId,
        },
    ]);

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

    const shouldShowHeader = (currentMsg: Message, prevMsg?: Message) => {
        if (!prevMsg) return true;
        const currentTime = new Date(currentMsg.sent_at).getTime();
        const prevTime = new Date(prevMsg.sent_at).getTime();
        const diffInMinutes = (currentTime - prevTime) / (1000 * 60);

        return diffInMinutes > 30; // true si plus de 30 min d'écart
    };

    const reversedMessages = React.useMemo(() => [...messages].reverse(), [messages]);

    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            message_content: inputText.trim(),
            sent_at: new Date().toISOString(),
            read_at: null,
            has_attachment: false,
            reply_to_id_message: null,
            id_conversation: 1,
            id_sender: 'moi',
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
    };


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
                                    <Flex justifyContent='center' alignItems='center' gap={activeTheme.spacing._100}>
                                        <Avatar size='veryLarge' customImage={presentation?.profile_picture} />
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

                                    <Text variant='body_Large'>{presentation?.bio}</Text>

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

                                    {/* Bulle de message */}
                                    {/* Si item.reply_to_id_message est non null, on affiche une bulle en mode reply en plus*/}

                                    {/* <Flex border fullWidth> */}
                                    {
                                        repliedMessage && (
                                            <MessageBubble
                                                content={repliedMessage?.message_content}
                                                type={'reply'}
                                                label={`En réponse à ${repliedSenderName}`}
                                                messageLabelType={'hour'}
                                                latest
                                            />
                                        )
                                    }
                                    {
                                        item.attachments && item.attachments.length > 0 && (
                                            <Flex direction='row' style={{ width: 150, marginBottom: -activeTheme.spacing._100 }}>
                                                {item.attachments.map((attachment) => (
                                                    <ImageRatio
                                                        key={attachment.id}
                                                        ratio='2:3'
                                                        source={{ uri: attachment.file_path }}
                                                        style={{ borderRadius: activeTheme.radius.card }}
                                                    />
                                                ))}
                                            </Flex>
                                        )
                                    }
                                    {/* </Flex> */}
                                    <MessageBubble
                                        content={item.message_content}
                                        type={isMe ? 'me' : 'someone_else'}
                                        latest={isLatest}
                                        label={formattedTime}
                                        messageLabelType={messageLabelType}
                                    />
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
                                handleSend()
                            }}
                        />
                    </Flex>
                </Flex>

            </KeyboardStickyView>
        </>
    );
}
