import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

// Composants
import Avatar, { AvatarSize } from '#/display/Avatar';
import HighlightedText from '#/display/HighlightedText';
import Flex from '#/Flex';
import Text, { TextType, TextVariant } from '#/Text';

// Icônes
import { Certification, Circle } from '#/icons';

export type LeftVariant = 'empty' | 'avatar' | 'icon';

export interface TableLeftProps {
    variant?: LeftVariant;
    leftText?: string;
    leftTextType?: TextType;
    leftTextVariant?: TextVariant;
    legendText?: string;
    legendTextType?: TextType;
    legendTextVariant?: TextVariant;
    numberOfLines?: number;
    icon?: React.ReactNode;
    src?: ImageSourcePropType | string;
    avatarSize?: AvatarSize;
    read?: boolean;
    certified?: boolean;
    certificationColor?: string;
    searchQuery?: string;
    keepIconColor?: boolean;
    onAvatarPress?: () => void;
}

const TableLeft: React.FC<TableLeftProps> = ({
    variant = 'empty',
    leftText = 'Texte',
    leftTextType = 'primary',
    leftTextVariant = 'body_Large',
    legendText = '',
    legendTextType = 'secondary',
    legendTextVariant = 'body_Medium',
    numberOfLines,
    icon,
    src,
    avatarSize = 'medium',
    read = true,
    certified = false,
    certificationColor,
    searchQuery,
    keepIconColor = false,
    onAvatarPress
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'avatar':
                return <Avatar size={avatarSize} customImage={src} onPress={onAvatarPress} />;
            case 'icon': {
                if (icon == null) return null;
                if (icon === undefined) return <Circle size={24} color={iconColor} />;
                if (!React.isValidElement(icon)) return <Text>{icon}</Text>;
                if (keepIconColor) return icon;
                const typedIcon = icon as React.ReactElement<{ color?: string; fill?: string }>;
                return React.cloneElement(typedIcon, {
                    color: typedIcon.props.color ?? iconColor,
                    fill: typedIcon.props.fill ?? iconColor,
                });
            }
            default:
                return null;
        }
    };

    return (
        <Flex
            // border borderColor='purple' borderWidth={2} 
            direction='row' gap={activeTheme.spacing._100} style={styles.container}
        >
            {getVariantComponent()}

            {leftText && (
                <Flex
                    // border borderColor='red'
                    style={styles.leftText}
                >
                    <Flex direction='row'>
                        {searchQuery ? (
                            <HighlightedText
                                text={leftText}
                                highlight={searchQuery ?? ''}
                                variant={leftTextVariant}
                                type={leftTextType}
                                weight={!read ? 'bold' : 'regular'}
                                numberOfLines={numberOfLines}
                            />
                        ) : (
                            <Text
                                variant={leftTextVariant}
                                type={leftTextType}
                                weight={!read ? 'bold' : 'regular'}
                                numberOfLines={numberOfLines}
                            >
                                {leftText}
                            </Text>
                        )}
                        {certified && <Certification filled size={24} color={certificationColor} />}
                    </Flex>
                    {legendText && (
                        <>
                            {searchQuery ? (
                                <HighlightedText
                                    text={legendText}
                                    highlight={searchQuery ?? ''}
                                    variant={legendTextVariant}
                                    type={legendTextType}
                                    weight={!read ? 'bold' : 'regular'}
                                    numberOfLines={numberOfLines}
                                />
                            ) : (
                                <Text
                                    variant={legendTextVariant}
                                    type={read ? (legendTextType ?? 'secondary') : 'primary'}
                                    weight={!read ? 'bold' : 'regular'}
                                    numberOfLines={numberOfLines}
                                >
                                    {legendText}
                                </Text>
                            )}
                        </>

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
