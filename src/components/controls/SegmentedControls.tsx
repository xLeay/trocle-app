import React from 'react';
import { Pressable, StyleSheet } from 'react-native';


import Flex from '#/Flex';
import Text from '#/Text';

import { useTheme } from '@/src/lib/hooks/useTheme';


interface SegmentedControlsProps {
    options: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

const SegmentedControls: React.FC<SegmentedControlsProps> = ({
    options,
    selectedIndex,
    onChange,
}) => {

    const { activeTheme } = useTheme();

    return (
        <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            style={[
                styles.container,
                {
                    backgroundColor: activeTheme.colors.surface.divider,
                    padding: 2,
                    borderRadius: activeTheme.radius.default,
                },
            ]}
        >
            {options.map((option, index) => {
                const isActive = index === selectedIndex;
                return (
                    <Pressable
                        key={option}
                        onPress={() => onChange(index)}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: isActive
                                    ? activeTheme.colors.surface.secondary
                                    : 'transparent',
                                borderRadius: activeTheme.radius.default - 2,
                            },
                            isActive && styles.activeSegment,
                        ]}
                    >
                        <Flex alignItems="center" justifyContent="center" style={{ height: '100%', width: '100%' }}>
                            <Text variant="label_Medium">
                                {option}
                            </Text>
                        </Flex>
                    </Pressable>
                );
            })}
        </Flex>
    );
};

export default SegmentedControls;

const styles = StyleSheet.create({
    container: {
        height: 32,
        width: '100%',
    },
    segment: {
        flex: 1,
        height: '100%',
    },
    activeSegment: {
        boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.2)'
    },
});
