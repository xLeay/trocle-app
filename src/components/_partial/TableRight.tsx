import { useTheme } from '@/src/lib/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Composants
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Checkbox from '#/controls/Checkbox';
import Radio from '#/controls/Radio';
import Switch from '#/controls/Switch';

// Icônes
import { Chevronright, Circle } from '#/icons';

export type RightVariant =
    | 'empty'
    | 'text'
    | 'icon'
    | 'button'
    | 'switch'
    | 'checkbox'
    | 'radio'
    | 'timestamp';

export interface TableRightProps {
    variant?: RightVariant;
    active?: boolean;
    chevron?: boolean;
    rightText?: string;
    icon?: React.ReactNode;
    button?: React.ReactNode;
    switch?: React.ReactNode;
    checkbox?: React.ReactNode;
    radio?: React.ReactNode;
    timestampText?: string;
    read?: boolean;
}

const TableRight: React.FC<TableRightProps> = ({
    variant = 'empty',
    active = false,
    chevron = true,
    rightText = 'Lien',
    icon,
    button: buttonElement,
    switch: switchElement,
    checkbox: checkboxElement,
    radio: radioElement,
    timestampText = 'Timestamp',
    read = true,
}) => {

    const { activeTheme } = useTheme();
    const iconColor = activeTheme.colors.icon.primary;

    const getVariantComponent = () => {
        switch (variant) {
            case 'empty':
                return <View style={styles.empty} />;
            case 'text':
                return (
                    <Flex direction='row' gap={activeTheme.spacing._50} style={styles.rightText}>
                        <Text variant="body_Large" type={active ? 'brand' : 'primary'}>
                            {rightText}
                        </Text>
                        {chevron && (
                            <Chevronright size={24} color={iconColor} />
                        )}
                    </Flex>
                )
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
            case 'button':
                return buttonElement === undefined ? (
                    <Button label="Bouton" variant="primary" size="small" />
                ) : (
                    buttonElement
                );
            case 'switch':
                return switchElement === undefined ? (
                    <Switch onValueChange={() => { }} />
                ) : (
                    switchElement
                );
            case 'checkbox':
                return checkboxElement === undefined ? (
                    <Checkbox onValueChange={() => { }} />
                ) : (
                    checkboxElement
                );
            case 'radio':
                return radioElement === undefined ? (
                    <Radio onValueChange={() => { }} />
                ) : (
                    radioElement
                );
            case 'timestamp':
                return (
                    <Flex style={[styles.timeStamp, { flex: 1, minHeight: 48, paddingBlock: activeTheme.spacing._50 }]}>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                            <View style={[styles.timeStampDot, { backgroundColor: read ? activeTheme.colors.text.placeholder : activeTheme.colors.text.brand }]} />
                            <Text variant="body_Small" type={read ? 'placeholder' : 'brand'} >
                                {timestampText}
                            </Text>
                        </Flex>
                    </Flex>
                )
            default:
                return null;
        }
    };

    return (
        <Flex
            // border borderColor='blue'
            direction='column' gap={activeTheme.spacing._100} style={styles.container}>
            {getVariantComponent()}
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        justifyContent: 'center',
        // alignItems: 'center',

        // borderWidth: 1,
        // borderColor: 'blue',
        // flex: 1

    },
    empty: {
        width: 24,
        height: 24,
    },
    rightText: {
        alignItems: 'flex-end',
    },
    timeStamp: {
        height: '100%',
        alignItems: 'flex-start',
    },
    timeStampDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});

export default React.memo(TableRight);
