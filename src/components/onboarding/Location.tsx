
import { useTheme } from '@/src/lib/hooks/useTheme';

import Switch from '#/controls/Switch';
import Table from '#/display/Table';
import Flex from '#/Flex';
import Text from '#/Text';

import { Location as LocIcon } from '#/icons';
import { TrocleLogoPicto } from '#/logos';

interface LocationSectionProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    locationError: Error | string | null;
}

function LocationSection({
    value,
    onValueChange,
    locationError,
}: LocationSectionProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._800} style={{ flex: 1 }}>
            <Flex fullWidth gap={activeTheme.spacing._100}>
                <Table
                    leftProps={{
                        variant: 'icon',
                        icon: <LocIcon />,
                        leftText: 'Localisation'
                    }}
                    rightProps={{
                        variant: 'switch',
                        switch: <Switch checked={value} onValueChange={onValueChange} />
                    }}
                    onPress={() => onValueChange(!value)}
                />

                {locationError && (
                    <Text variant='body_Large' type='danger'>{locationError?.toString?.()}</Text>
                )}
            </Flex>

            <Flex fullWidth alignItems='center' justifyContent='center'>

                <Flex
                    style={{
                        height: 175,
                        width: 175,
                        backgroundColor: activeTheme.colors.surface.brandSecondaryLight,
                        borderWidth: 4,
                        borderColor: activeTheme.colors.surface.brandSecondary,
                        borderRadius: activeTheme.radius.full,
                        position: 'relative',
                    }}
                >

                    <Flex
                        style={{
                            height: 100,
                            width: 100,
                            backgroundColor: activeTheme.colors.surface.brandLight,
                            borderWidth: 4,
                            borderColor: activeTheme.colors.surface.brand,
                            borderRadius: activeTheme.radius.full,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                            zIndex: 1
                        }}
                    />

                    <Flex
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                            zIndex: 2
                        }}
                    >
                        <TrocleLogoPicto variant='large' color='trocle' />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default LocationSection;