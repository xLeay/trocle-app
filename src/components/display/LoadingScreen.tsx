import { ActivityIndicator } from 'react-native';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import { useTheme } from '@/src/lib/hooks/useTheme';

type LoadingScreenProps = {
    message?: string;
};

export default function LoadingScreen({ message = 'Chargement...' }: LoadingScreenProps) {
    const { activeTheme } = useTheme();

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Flex
                fullWidth
                alignItems="center"
                justifyContent="center"
                gap={activeTheme.spacing._100}
                style={{ flex: 1 }}
            >
                <ActivityIndicator size="large" color={activeTheme.colors.surface.brand} />
                {message ? (
                    <Text variant="body_Medium" type="secondary">
                        {message}
                    </Text>
                ) : null}
            </Flex>
        </CustomSafeAreaView>
    );
}
