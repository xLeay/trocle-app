import React from 'react';
import { ViewStyle } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';

export type BadgeStatusVariant = 'success' | 'error' | 'warning' | 'information' | 'neutral';

interface IconProps {
    color?: string;
    filled?: boolean;
    size?: number;
}

export interface BadgeStatusProps {
    label: string;
    icon?: React.ReactNode;
    variant?: BadgeStatusVariant;
    style?: ViewStyle;
}

export default function BadgeStatus({
    label,
    icon,
    variant = 'neutral',
    style,
}: BadgeStatusProps) {
    const { activeTheme } = useTheme();

    const getVariantColors = (v: BadgeStatusVariant) => {
        switch (v) {
            case 'success':
                return {
                    bg: activeTheme.colors.surface.successLight,
                    color: activeTheme.colors.surface.success,
                };
            case 'error':
                return {
                    bg: activeTheme.colors.surface.dangerLight,
                    color: activeTheme.colors.surface.danger,
                };
            case 'warning':
                return {
                    bg: activeTheme.colors.surface.alertLight,
                    color: activeTheme.colors.surface.alert,
                };
            case 'information':
                return {
                    bg: activeTheme.colors.surface.blueLight,
                    color: activeTheme.colors.surface.blue,
                };
            case 'neutral':
            default:
                return {
                    bg: activeTheme.colors.surface.neutralLight,
                    color: activeTheme.colors.surface.neutral,
                };
        }
    };

    const { bg, color } = getVariantColors(variant);

    return (
        <Flex
            direction="row"
            alignItems="center"
            gap={activeTheme.spacing._0}
            style={{
                backgroundColor: bg,
                paddingBlock: 2,
                paddingInline: activeTheme.spacing._50,
                borderRadius: activeTheme.radius.full,
            }}
        >
            {icon && (
                <Flex alignItems='center'>
                    {React.isValidElement(icon)
                        ? React.cloneElement(icon as React.ReactElement<IconProps>, {
                            color: (icon.props as IconProps).color ?? color,
                            size: (icon.props as IconProps).size ?? 16,
                            filled: (icon.props as IconProps).filled ?? false
                        })
                        : icon}
                </Flex>
            )}

            <Flex style={{ paddingInline: activeTheme.spacing._50 }}>
                <Text variant="body_Medium" style={{ color }}>
                    {label}
                </Text>
            </Flex>
        </Flex>
    );
}
