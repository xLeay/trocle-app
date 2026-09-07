import { ActivityIndicator, ImageSourcePropType } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';




import Flex from '#/Flex';
import Text from '#/Text';
import Avatar, { sizeMapping } from '#/display/Avatar';

interface AvatarSectionProps {
    value: string | ImageSourcePropType | undefined;
    isLoadingAvatar: boolean;
    avatarError: Error | string | null;
}

function AvatarSection({
    value,
    isLoadingAvatar,
    avatarError,
}: AvatarSectionProps) {
    const { activeTheme } = useTheme();

    const sizeH_W = sizeMapping['enormous'];

    return (
        <Flex
            fullWidth
            gap={activeTheme.spacing._400}
            alignItems='center'
            justifyContent='center'
        >
            {isLoadingAvatar ? (
                <Flex justifyContent='center' alignItems='center' style={{ height: sizeH_W, width: sizeH_W }}>
                    <ActivityIndicator size={sizeH_W / 2} color={activeTheme.colors.surface.brand} />
                </Flex>
            ) : (
                <Flex style={{
                    borderRadius: activeTheme.radius.full,
                    borderWidth: 5,
                    borderColor: activeTheme.colors.surface.primary,
                    boxShadow: "0px 4px 9px 3px rgba(0, 0, 0, 0.25)"
                }}>
                    <Avatar touchable={false} customImage={value} size='enormous' onPress={() => { }} />
                </Flex>
            )}

            <Text variant='body_Large' type='danger'>{avatarError?.toString()}</Text>
        </Flex>
    );
}

export default AvatarSection;
