import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

import AvatarProps from '#/display/Avatar';

// Composants
import Flex from '#/Flex';
import Text from '#/Text';
import Avatar from '#/display/Avatar';

// Icônes
import { Circle } from '#/icons';

export type TabBar = 'icon' | 'avatar';

export interface TabBarProps {
    variant?: TabBar;
    icon?: React.ReactNode;
    avatarProps?: React.ComponentProps<typeof AvatarProps>;
}

const TabBar: React.FC<TabBarProps> = ({
    variant = 'icon',
    icon,
    avatarProps,
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'avatar':
                return <Avatar size='tiny' {...avatarProps} />;
            case 'icon':
                return icon === undefined ? (
                    <Circle size={36} color={iconColor} />
                ) : (
                    React.isValidElement(icon)
                        ? React.cloneElement(
                            icon as React.ReactElement<{ color?: string; fill?: string; size?: number; filled?: boolean }>,
                            {
                                color: icon.props.color ?? iconColor,
                                fill: icon.props.fill ?? iconColor,
                                size: icon.props.size ?? 36,
                                filled: icon.props.filled ?? false,
                            }
                        )
                        : icon
                );
            default:
                return null;
        }
    };

    return (
        <Flex direction='row' style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}>
            {getVariantComponent()}
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        minWidth: 75,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 1,
        // borderColor: 'red',
    },
});

export default TabBar;
