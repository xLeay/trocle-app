import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

import AvatarProps from '#/display/Avatar';

// Composants
import Flex from '#/Flex';
import TabBar from '#/_partial/TabBar';

export type NavigationBarItem = {
    icon?: React.ReactNode;
    avatar?: React.ComponentProps<typeof AvatarProps>;
};

export interface NavigationBarProps {
    navBarList?: NavigationBarItem[];
}

const NavigationBar: React.FC<NavigationBarProps> = ({
    navBarList = [],
}) => {

    const { activeTheme } = useTheme();

    return (
        <Flex direction='row' style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary, borderTopWidth: 1, borderColor: activeTheme.colors.surface.divider }]}>
            {navBarList.map((item, index) => (
                <TabBar
                    key={index}
                    variant={item.avatar ? 'avatar' : 'icon'}
                    avatarProps={item.avatar}
                    icon={item.icon}
                />
            ))}
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NavigationBar;
