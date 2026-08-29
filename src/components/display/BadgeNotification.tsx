
import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';


export interface BadgeNotificationProps {
    label?: number | null;
}

export default function BadgeNotification({
    label,
}: BadgeNotificationProps) {
    const { activeTheme } = useTheme();

    const computedLabel = label && label > 20 ? "20+" : label;
    const isSingleDigit = label !== null && label !== undefined && label < 10;
    const noLabel = label === null || label === undefined;

    return (
        <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            style={{
                width: isSingleDigit ? 16 : undefined,
                height: noLabel ? 6 : 16,
                minWidth: noLabel ? 6 : 16,
                backgroundColor: activeTheme.colors.surface.brand,
                paddingInline: noLabel ? 0 : (isSingleDigit ? 0 : activeTheme.spacing._50),
                borderRadius: activeTheme.radius.full,
            }}
        >
            {!noLabel && (
                <Text variant="label_Medium" type='invert'>{computedLabel}</Text>
            )}
        </Flex>
    );
}
