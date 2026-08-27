import { useEffect, useState } from 'react';
import { Pressable, ViewStyle } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';
import MessageLabel, { MessageLabelType } from '#/_partial/MessageLabel';

type MessageBubbleType = 'me' | 'someone_else';

interface MessageBubbleProps {
    content?: string;
    type: MessageBubbleType;
    isReply?: boolean;
    latest?: boolean;
    label?: string;
    messageLabelType?: MessageLabelType;
    onPress?: () => void;
    onLongPress?: () => void;
}

export function MessageBubble({
    content,
    type = 'me',
    isReply = false,
    latest = false,
    label,
    messageLabelType = 'hour',
    onPress,
    onLongPress,
}: MessageBubbleProps) {
    const { activeTheme } = useTheme();

    const isMe = type === 'me';


    const [showLabel, setShowLabel] = useState(latest);


    // Si pas latest -> 24 partout
    // Si latest -> angle de 4 en bas selon isMe
    const borderBottomLeftRadius = latest ? (isMe ? 24 : 4) : 24;
    const borderBottomRightRadius = latest ? (isMe ? 4 : 24) : 24;


    const defaultBubbleStyle: ViewStyle = {
        paddingInline: activeTheme.spacing._200,
        paddingBlock: 12,
        minHeight: 24,
        maxWidth: '85%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        backgroundColor: isMe ? activeTheme.colors.surface.brand : activeTheme.colors.surface.divider
    }

    const replyStyle: ViewStyle = {
        minHeight: 24,
        maxWidth: '60%',
        backgroundColor: activeTheme.colors.surface.secondary,
        borderWidth: 1,
        borderColor: activeTheme.colors.surface.divider,
        borderRadius: 24,
        padding: activeTheme.spacing._100,
        marginBottom: -12
    };

    const finalStyle = isReply ? replyStyle : defaultBubbleStyle


    const handlePress = () => {
        setShowLabel((prev) => !prev);
        onPress?.();
    };

    useEffect(() => {
        setShowLabel(latest);
    }, [latest]);

    return (
        <Pressable onPress={handlePress} onLongPress={onLongPress}>
            <Flex
                direction={isReply ? 'column-reverse' : 'column'}
                alignItems={isMe ? 'flex-end' : 'flex-start'}
                justifyContent='center'
                gap={activeTheme.spacing._50}>
                <Flex style={finalStyle}>
                    <Text
                        variant={isReply ? 'body_Small' : 'body_Large'}
                        type={isReply ? 'placeholder' : (isMe ? 'invert' : 'primary')}
                    >{content}</Text>
                </Flex>

                {showLabel && (
                    <MessageLabel
                        label={label}
                        type={messageLabelType}
                    />
                )}
            </Flex>
        </Pressable>
    );
}

export default MessageBubble;
