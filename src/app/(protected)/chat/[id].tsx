import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import TextField from '#/controls/TextField';
import Button from '#/controls/Button';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import MessageBar from '#/bars/MessageBar'

import { Troc } from '#/icons';

import { MOCK_CONVERSATIONS } from '@/src/mock/dms.mock';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

export default function ChatScreen() {
    const { activeTheme } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();

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
            certificationColor: activeTheme.colors.icon.brand,
            numberOfLines: 1,
        },
        tableRight: {
            variant: 'button',
            button: (
                <Button label="Troc" variant="outlined" size="small" icon={<Troc filled size={24} color={activeTheme.colors.surface.contrast} />} iconPosition='right' onPress={() => console.log('Proposer le Troc à ' + recipientName)} />
            ),
        },
    });


    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Bonjour ! Merci pour ton intérêt pour le troc.',
            sender: 'other',
            timestamp: '14:30',
        },
        {
            id: '2',
            text: conversation?.lastMessage || 'Super, on s’organise comment ?',
            sender: 'other',
            timestamp: '14:32',
        },
    ]);

    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary, borderWidth: 1, borderColor: 'red' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={40}
            >
                <Flex style={{ flex: 1, paddingHorizontal: activeTheme.spacing._200 }}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingVertical: activeTheme.spacing._200, gap: activeTheme.spacing._50 }}
                        renderItem={({ item }) => {
                            const isMe = item.sender === 'me';
                            return (
                                <Flex
                                    alignItems={isMe ? 'flex-end' : 'flex-start'}
                                    style={{ width: '100%' }}
                                >
                                    <Flex
                                        style={[
                                            styles.bubble,
                                            {
                                                backgroundColor: isMe
                                                    ? activeTheme.colors.surface.primary
                                                    : activeTheme.colors.surface.secondary,
                                                borderRadius: activeTheme.radius.default,
                                                padding: activeTheme.spacing._50,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: isMe
                                                    ? activeTheme.colors.text.invert
                                                    : activeTheme.colors.text.primary,
                                            }}
                                        >
                                            {item.text}
                                        </Text>
                                        <Text
                                            variant="body_Small"
                                            style={{
                                                marginTop: 4,
                                                alignSelf: 'flex-end',
                                                color: isMe
                                                    ? activeTheme.colors.text.invert
                                                    : activeTheme.colors.text.placeholder,
                                                fontSize: 10,
                                            }}
                                        >
                                            {item.timestamp}
                                        </Text>
                                    </Flex>
                                </Flex>
                            );
                        }}
                    />

                    {/* Zone de saisie */}

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
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '80%',
    },
});

