import { router } from 'expo-router';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import { useTheme } from '@/src/lib/hooks/useTheme';

type NotFoundScreenProps = {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionIcon?: React.ReactElement;
    onAction?: () => void;
};

export default function NotFoundScreen({
    title = 'Contenu introuvable',
    description = "L'élément que vous recherchez n'existe pas ou a été supprimé.",
    actionLabel = 'Retour',
    actionIcon,
    onAction,
}: NotFoundScreenProps) {
    const { activeTheme } = useTheme();

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Flex
                fullWidth
                alignItems="center"
                justifyContent="center"
                gap={activeTheme.spacing._200}
                style={{ flex: 1, padding: activeTheme.spacing._200 }}
            >
                <Flex direction="column" alignItems="center" gap={activeTheme.spacing._50}>
                    <Text variant="title_Large" type="primary" style={{ textAlign: 'center' }}>
                        {title}
                    </Text>
                    <Text variant="body_Medium" type="secondary" style={{ textAlign: 'center' }}>
                        {description}
                    </Text>
                </Flex>

                {actionIcon && (
                    <Button
                        label={actionLabel}
                        variant="secondary"
                        size="large"
                        onPress={handleAction}
                        icon={actionIcon}
                        iconPosition="right"
                    />
                )}
            </Flex>
        </CustomSafeAreaView>
    );
}
