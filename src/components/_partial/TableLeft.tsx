import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

// Composants
import Flex from '#/Flex';
import Avatar, { AvatarSize } from '#/display/Avatar';
import HighlightedText from '#/display/HighlightedText';

// Icônes
import { Certification, Circle } from '#/icons';

export type LeftVariant = 'empty' | 'avatar' | 'icon';

export interface TableLeftProps {
    variant?: LeftVariant;
    leftText?: string;
    legendText?: string;
    numberOfLines?: number;
    icon?: React.ReactNode;
    src?: ImageSourcePropType | string;
    avatarSize?: AvatarSize;
    read?: boolean;
    certified?: boolean;
    certificationColor?: string;
    searchQuery?: string;
}

const TableLeft: React.FC<TableLeftProps> = ({
    variant = 'empty',
    leftText = 'Texte',
    legendText = '',
    numberOfLines,
    icon,
    src,
    avatarSize = 'medium',
    read = true,
    certified = false,
    certificationColor,
    searchQuery
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'avatar':
                return <Avatar size={avatarSize} customImage={src} />;
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
        <Flex
            // border borderColor='purple' borderWidth={2} 
            direction='row' gap={activeTheme.spacing._100} style={styles.container}>
            {getVariantComponent()}

            {leftText && (
                <Flex
                    // border borderColor='red'
                    style={styles.leftText}>
                    <Flex direction='row'>
                        {/* <Text
                            variant="body_Large"
                            weight={!read ? 'bold' : 'regular'}
                            numberOfLines={numberOfLines}
                        >
                            {leftText}
                        </Text> */}
                        <HighlightedText
                            text={leftText}
                            highlight={searchQuery ?? ''}
                            variant="body_Large"
                            weight={!read ? 'bold' : 'regular'}
                            numberOfLines={numberOfLines}
                        />
                        {certified && <Certification filled size={24} color={certificationColor} />}
                    </Flex>
                    {legendText && (
                        // <Text
                        //     variant="body_Medium"
                        //     type={!read ? 'primary' : 'secondary'}
                        //     weight={!read ? 'bold' : 'regular'}
                        //     numberOfLines={numberOfLines}
                        // >
                        //     {legendText}
                        // </Text>
                        <HighlightedText
                            text={legendText}
                            highlight={searchQuery ?? ''}
                            variant="body_Medium"
                            weight={!read ? 'bold' : 'regular'}
                            numberOfLines={numberOfLines}
                        />
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

        // width: '100%',
        flex: 1,

        overflow: 'hidden'

    },
    leftText: {
        alignItems: 'flex-start',
        flex: 1
        // width: '100%',


    },
});

export default React.memo(TableLeft);
