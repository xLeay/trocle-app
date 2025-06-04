import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useRef } from 'react';
import { Pressable, TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet } from 'react-native';

// Composants
import Flex from '#/Flex';
import Text from '#/Text';
import TextInput from '#/TextInput';

// Icones
import { Chevronbottom, Eye, Eyeslash } from '#/icons';

interface IconProps {
    color?: string;
    fill?: string;
}

export type TextFieldType = 'text' | 'icon' | 'dropdown' | 'password' | 'number' | 'action';
export type TextFieldState = 'default' | 'focused' | 'filled' | 'error';

interface TextFieldProps extends RNTextInputProps {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: TextFieldType;
    icon?: React.ReactNode;
    action?: () => void;
    hasError?: boolean;
    label?: string;
    legend?: string;
    autoCapitalize?: RNTextInputProps['autoCapitalize'];
    maxLength?: number;
    numberOfLines?: number;
    multiline?: boolean;
    keyboardType?: RNTextInputProps['keyboardType'];
}

const TextField = ({
    onChangeText,
    value = '',
    placeholder = 'Champ de texte',
    disabled = false,
    type = 'text',
    icon,
    action,
    hasError = false,
    label,
    legend,
    autoCapitalize,
    maxLength,
    numberOfLines = 1,
    multiline = false,
    keyboardType = 'default',
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
        <Flex gap={activeTheme.spacing._100} style={{ width: '100%' }}>
            {label && (
                <Text variant='title_Small' style={{ color: hasError ? activeTheme.colors.surface.danger : '' }}>{label}</Text>
            )}

            <Flex direction='row'
                alignItems='center'
                gap={8}
                style={[styles.container, containerStyle, {
                    paddingHorizontal: activeTheme.spacing._200,
                    borderRadius: activeTheme.radius.default,
                    backgroundColor: activeTheme.colors.surface.primary,
                    width: '100%'
                }]}
            >
                <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                        handleFocus();
                    }}
                    disabled={disabled}
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
                            autoCapitalize={autoCapitalize}
                            maxLength={maxLength}
                            numberOfLines={numberOfLines}
                            multiline={multiline}
                            underlineColorAndroid={'transparent'}
                            keyboardType={keyboardType}
                        />
                        {type === 'dropdown' && (
                            <Chevronbottom />
                        )}
                        {type === 'password' && (
                            <Pressable onPress={handlePasswordVisibility} disabled={disabled}>
                                {isPasswordVisible ? <Eye color={iconColor} /> : <Eyeslash color={iconColor} />}
                            </Pressable>
                        )}
                        {type === 'action' && icon && action && (
                            <Pressable onPress={action} disabled={disabled}>
                                {React.isValidElement(icon)
                                    ? React.cloneElement(icon as React.ReactElement<any>, {
                                        color: (icon.props as IconProps).color ?? iconColor,
                                        fill: (icon.props as IconProps).fill ?? iconColor,
                                    })
                                    : icon}
                            </Pressable>
                        )}
                    </Flex>
                </Pressable>
            </Flex>

            {legend && (
                <Text variant='body_Medium' type='placeholder' style={{ color: hasError ? activeTheme.colors.surface.danger : '' }}>{legend}</Text>
            )}
        </Flex>
    );
}

export default TextField;

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
    },
    input: {
        // borderWidth: 0.5,
        // borderColor: 'red',
    },
});
