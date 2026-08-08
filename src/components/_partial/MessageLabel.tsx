import React from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';


export type MessageLabelType = 'hour' | 'sent' | 'read';

interface MessageLabelProps {
    label?: string;
    type: MessageLabelType;
}

export function MessageLabel({
    label,
    type = 'hour',
}: MessageLabelProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex direction='row' alignItems='center' justifyContent='flex-start' gap={2}>
            <Text variant="body_Small" type='secondary'>{label}</Text>
            {
                type !== 'hour' && (
                    <>
                        <Flex style={{ height: 2, width: 2, borderRadius: 2, backgroundColor: activeTheme.colors.text.secondary }}></Flex>
                        <Text variant="body_Small" type='secondary'>{type === 'read' ? 'Vu' : 'Envoyé'}</Text>
                    </>
                )
            }
        </Flex>
    );
}

export default MessageLabel;
