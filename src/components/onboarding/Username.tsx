import { ActivityIndicator } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from "#/Flex";
import Text from "#/Text";
import TextField from "#/controls/TextField";

import { At, Close, Done } from '#/icons';

interface UsernameProps {
    valueUsername: string;
    onChangeUsername: (text: string) => void;
    isCheckingUsername?: boolean;
    isUsernameValid?: boolean;
    error?: boolean;
    errorMessage?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

function Username({
    valueUsername,
    onChangeUsername,
    isCheckingUsername,
    isUsernameValid,
    error = false,
    errorMessage = '',
    onFocus,
    onBlur,
}: UsernameProps) {
    const { activeTheme } = useTheme();

    const helperText = isUsernameValid ? 'Pseudonyme valide' : '';
    const leadingIcon = () => {
        if (isCheckingUsername) {
            return <ActivityIndicator size="small" color={activeTheme.colors.surface.brand} />;
        }
        if (isUsernameValid) {
            return <Done size={20} color={activeTheme.colors.icon.success} />;
        }
        if (error && errorMessage) {
            return <Close size={20} color={activeTheme.colors.icon.danger} />;
        }
        return null;
    };

    return (
        <Flex style={{}}>
            <TextField
                type='icon'
                icon={<At />}
                value={valueUsername}
                onChangeText={onChangeUsername}
                legend={errorMessage}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{}}>
                {leadingIcon()}
                <Text variant='body_Small'>{helperText}</Text>
            </Flex>
        </Flex>
    )

}

export default Username