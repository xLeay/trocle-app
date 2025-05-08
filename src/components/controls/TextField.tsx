import React, { useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { TextInput as RNTextInput } from 'react-native';
import { TextInputProps as RNTextInputProps } from 'react-native'

// Composants
import TextInput from '#/TextInput';
import Button from '#/controls/Button';
import Flex from '#/Flex';
import Text from '#/Text';

// Icones
import { Chevronbottom, Circle, Closecircle, Eye, Eyeslash } from '#/icons';

interface IconProps {
    color?: string;
    fill?: string;
}

export type TextFieldType = 'text' | 'icon' | 'dropdown' | 'password';
export type TextFieldState = 'default' | 'focused' | 'filled' | 'error';

interface TextFieldProps extends RNTextInputProps {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: TextFieldType;
    icon?: React.ReactNode;
    hasError?: boolean;
    label?: string;
    legend?: string;
}

const TextField = ({
    onChangeText,
    value = '',
    placeholder = 'Champ de texte',
    disabled = false,
    type = 'text',
    icon,
    hasError = false,
    label,
    legend,
}: TextFieldProps) => {
    const { activeTheme } = useTheme();
    const inputRef = useRef<RNTextInput>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const handlePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const handleFocus = () => {
        setIsFocused(true)
    };

    const handleBlur = () => {
        setIsFocused(false)
    };

    const isFilled = value && value.length > 0;
    const iconColor = isFilled
        ? activeTheme.colors.text.primary
        : activeTheme.colors.text.placeholder;

    const state: TextFieldState =
        hasError ? 'error' :
            isFocused ? 'focused' :
                isFilled ? 'filled' :
                    'default';


    const disabledStyle = {
        borderWidth: 1,
        borderColor: activeTheme.colors.surface.divider,
        backgroundColor: activeTheme.colors.surface.secondary,
    }
    const errorStyle = {
        borderWidth: 2,
        borderColor: activeTheme.colors.surface.danger,
    }
    const focusedStyle = {
        borderWidth: 2,
        borderColor: activeTheme.colors.border.blue,
    }
    const defaultStyle = {
        borderWidth: 1,
        borderColor: activeTheme.colors.surface.field,
    }

    const containerStyle =
        disabled ? disabledStyle :
            state === 'error' ? errorStyle :
                state === 'focused' ? focusedStyle :
                    defaultStyle;

    const textType = disabled ? 'placeholder' : 'primary';
    return (
        <Flex gap={activeTheme.spacing._100}>
            {label && (
                <Text variant='title_Small'>{label}</Text>
            )}

            <Flex direction='row'
                alignItems='center'
                gap={8}
                style={[styles.container, containerStyle, {
                    paddingHorizontal: activeTheme.spacing._200,
                    borderRadius: activeTheme.radius.default,
                    backgroundColor: activeTheme.colors.surface.primary,
                }]}
            >
                <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                        handleFocus();
                    }}
                >
                    <Flex direction='row' alignItems='center' gap={activeTheme.spacing._100} style={{ flex: 1 }}>
                        {type === 'icon' && icon && (
                            React.isValidElement(icon)
                                ? React.cloneElement(icon as React.ReactElement<any>, {
                                    color: (icon.props as IconProps).color ?? iconColor,
                                    fill: (icon.props as IconProps).fill ?? iconColor,
                                })
                                : icon
                        )}
                        <TextInput
                            ref={inputRef}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={onChangeText}
                            style={[styles.input]}
                            containerStyle={{ flex: 1 }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            editable={!disabled}
                            type={textType}
                            secureTextEntry={type === 'password' && !isPasswordVisible}
                        />
                        {type === 'dropdown' && (
                            <Chevronbottom />
                        )}
                        {type === 'password' && (
                            <Pressable onPress={handlePasswordVisibility}>
                                {isPasswordVisible ? <Eye color={iconColor} /> : <Eyeslash color={iconColor} />}
                            </Pressable>
                        )}
                    </Flex>
                </Pressable>
            </Flex>

            {legend && (
                <Text variant='body_Medium' type='placeholder'>{legend}</Text>
            )}
        </Flex>
    );
}

export default TextField;

const styles = StyleSheet.create({
    container: {
        height: 48,
    },
    input: {
        // borderWidth: 0.5,
        // borderColor: 'red',
    },
});
