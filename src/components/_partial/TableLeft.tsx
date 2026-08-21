import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';

// Composants
import Avatar, { AvatarSize } from '#/display/Avatar';
import HighlightedText from '#/display/HighlightedText';
import Flex from '#/Flex';
import Text, { TextType } from '#/Text';

// Icônes
import { Certification, Circle } from '#/icons';

export type LeftVariant = 'empty' | 'avatar' | 'icon';

export interface TableLeftProps {
    variant?: LeftVariant;
    leftText?: string;
    leftTextType?: TextType;
    legendText?: string;
    numberOfLines?: number;
    icon?: React.ReactNode;
    src?: ImageSourcePropType | string;
    avatarSize?: AvatarSize;
    read?: boolean;
    certified?: boolean;
    certificationColor?: string;
    searchQuery?: string;
    onAvatarPress?: () => void;
}

const TableLeft: React.FC<TableLeftProps> = ({
    variant = 'empty',
    leftText = 'Texte',
    leftTextType,
    legendText = '',
    numberOfLines,
    icon,
    src,
    avatarSize = 'medium',
    read = true,
    certified = false,
    certificationColor,
    searchQuery,
    onAvatarPress
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'avatar':
                return <Avatar size={avatarSize} customImage={src} onPress={onAvatarPress} />;
            case 'icon': {
                if (icon === undefined) return <Circle size={24} color={iconColor} />;
                if (!React.isValidElement(icon)) return icon;
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

                        {searchQuery ? (
                            <HighlightedText
                                text={leftText}
                                highlight={searchQuery ?? ''}
                                variant="body_Large"
                                type={leftTextType}
                                weight={!read ? 'bold' : 'regular'}
                                numberOfLines={numberOfLines}
                            />
                        ) : (
                            <Text
                                variant="body_Large"
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
                        // <Text
                        //     variant="body_Medium"
                        //     type={!read ? 'primary' : 'secondary'}
                        //     weight={!read ? 'bold' : 'regular'}
                        //     numberOfLines={numberOfLines}
                        // >
                        //     {legendText}
                        // </Text>
                        // <HighlightedText
                        //     text={legendText}
                        //     highlight={searchQuery ?? ''}
                        //     variant="body_Medium"
                        //     weight={!read ? 'bold' : 'regular'}
                        //     numberOfLines={numberOfLines}
                        // />

                        <>
                            {searchQuery ? (
                                <HighlightedText
                                    text={legendText}
                                    highlight={searchQuery ?? ''}
                                    variant="body_Medium"
                                    weight={!read ? 'bold' : 'regular'}
                                    numberOfLines={numberOfLines}
                                />
                            ) : (
                                <Text
                                    variant="body_Medium"
                                    type={!read ? 'primary' : 'secondary'}
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
