import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex'


interface CardProps {
    padding?: number;
    radius?: number;
    backgroundColor?: string;
    border?: boolean;
    borderColor?: string;
    borderWidth?: number;
    shadow?: boolean;
    overflow?: 'visible' | 'hidden';
    gap?: number;
    width?: DimensionValue;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    padding,
    radius,
    backgroundColor,
    border = true,
    borderColor,
    borderWidth = 1,
    shadow = false,
    overflow = 'visible',
    gap,
    width,
    children,
}) => {
    const { activeTheme } = useTheme();

    const shadowStyle = {
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)'
    };

    const viewStyle = {
        overflow: overflow,
        borderColor: borderColor ?? activeTheme.colors.surface.divider,
        borderWidth: border ? borderWidth : 0,
    };

    return (
        <Flex
            style={[
                {
                    padding: padding ?? activeTheme.spacing._200,
                    borderRadius: radius ?? activeTheme.radius.card,
                    backgroundColor: backgroundColor ?? activeTheme.colors.surface.primary,
                    gap: gap ?? activeTheme.spacing._200,
                    width: width ?? '100%',
                },
                viewStyle,
                shadow ? shadowStyle : {},
            ]}

        >
            {children}
        </Flex>
    );
};

const styles = StyleSheet.create({

});

export default Card;