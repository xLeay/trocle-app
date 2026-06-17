import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

// Composants
import Flex from '#/Flex';
import Text from '#/Text';
import Avatar from '#/display/Avatar';

// Icônes
import { Circle } from '#/icons';

export type LeftVariant = 'empty' | 'avatar' | 'icon';

export interface TableLeftProps {
    variant?: LeftVariant;
    leftText?: string;
    legendText?: string;
    icon?: React.ReactNode;
    src?: ImageSourcePropType | string;
}

const TableLeft: React.FC<TableLeftProps> = ({
    variant = 'empty',
    leftText = 'Texte',
    legendText = '',
    icon,
    src,
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'avatar':
                return <Avatar size="medium" customImage={src} />;
            case 'icon':
                return icon === undefined ? (
                    <Circle size={24} color={iconColor} />
                ) : (
                    React.isValidElement(icon)
                        ? React.cloneElement(
                            icon as React.ReactElement<{ color?: string; fill?: string }>,
                            {
                                color: icon.props.color ?? iconColor,
                                fill: icon.props.fill ?? iconColor,
                            }
                        )
                        : icon
                );
            default:
                return null;
        }
    };

    return (
        <Flex direction='row' gap={activeTheme.spacing._100} style={styles.container}>
            {getVariantComponent()}

            {leftText && (
                <Flex style={styles.leftText}>
                    <Text variant="body_Large">
                        {leftText}
                    </Text>
                    {legendText && (
                        <Text variant="body_Medium" type='secondary' >
                            {legendText}
                        </Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        justifyContent: 'flex-start',
        alignItems: 'center',

        // borderWidth: 1,
        // borderColor: 'red',
    },
    leftText: {
        alignItems: 'flex-start',
    },
});

export default React.memo(TableLeft);
