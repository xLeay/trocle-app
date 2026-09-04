import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useRef } from 'react';
import { Pressable, TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, ViewStyle } from 'react-native';

// Composants
import Flex from '#/Flex';
import Text from '#/Text';
import TextInput from '#/TextInput';

// Icones
import { Chevronbottom, Circle, Eye, Eyeslash, France, Germany } from '#/icons';

interface IconProps {
    color?: string;
    fill?: string;
}

export type TextFieldType = 'text' | 'icon' | 'dropdown' | 'password' | 'number' | 'action' | 'phone' | 'otp';
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
    hasSuccess?: boolean;
    label?: string;
    legend?: string;
    autoCapitalize?: RNTextInputProps['autoCapitalize'];
    maxLength?: number;
    numberOfLines?: number;
    multiline?: boolean;
    keyboardType?: RNTextInputProps['keyboardType'];
    style?: ViewStyle;
}

function getCountryFlagAndPhoneCode(countryCode: string) {
    switch (countryCode) {
        case 'FR':
            return {
                icon: <France size={16} />,
                code: '+33'
            };
        case 'DE':
            return {
                icon: <Germany size={16} />,
                code: '+49'
            };
        default:
            return {
                icon: <Circle size={16} />,
                code: '+33'
            };
    }
}

const TextField = React.forwardRef<RNTextInput, TextFieldProps>(({
    onChangeText,
    onKeyPress,
    textContentType,
    autoComplete,
    selectTextOnFocus,
    value = '',
    placeholder = 'Champ de texte',
    disabled = false,
    type = 'text',
    icon,
    action,
    hasError = false,
    hasSuccess = false,
    label,
    legend,
    autoCapitalize,
    maxLength,
    numberOfLines = 1,
    multiline = false,
    keyboardType = 'default',
    style = {},
}, forwardedRef) => {
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

    const legendTextType = hasError ?
        'danger' :
        hasSuccess ?
            'success' :
            'placeholder';

    const { icon: countryIcon, code: countryCode } = getCountryFlagAndPhoneCode('FR');

    return (
        <Flex
            fullWidth
            gap={activeTheme.spacing._100}
            style={{ flexShrink: 1 }}
        >
            {label && (
                <Text variant='title_Small' style={{ color: hasError ? activeTheme.colors.surface.danger : '' }}>{label}</Text>
            )}

            <Flex direction='row'
                alignItems='center'
                gap={8}
                style={[styles.container, containerStyle, {
                    // paddingHorizontal: activeTheme.spacing._200,
                    paddingHorizontal: type === 'phone' || type === 'otp' ? activeTheme.spacing._100 : activeTheme.spacing._200,
                    borderRadius: activeTheme.radius.default,
                    backgroundColor: activeTheme.colors.surface.primary,
                    width: '100%'
                },
                    style
                ]}
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
                        {type === 'phone' && (
                            <Flex
                                direction='row'
                                alignItems='center'
                                gap={activeTheme.spacing._50}
                                style={{
                                    backgroundColor: activeTheme.colors.surface.secondary,
                                    padding: activeTheme.spacing._100,
                                    borderRadius: activeTheme.radius.modal,
                                    borderWidth: 1,
                                    borderColor: activeTheme.colors.border.primary
                                }}
                            >
                                {countryIcon}
                                <Text variant='label_Medium' type='primary'>{countryCode}</Text>
                            </Flex>
                        )}
                        <TextInput
                            ref={(node) => {
                                inputRef.current = node;

                                if (typeof forwardedRef === 'function') {
                                    forwardedRef(node);
                                } else if (forwardedRef) {
                                    forwardedRef.current = node;
                                }
                            }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={onChangeText}
                            onKeyPress={onKeyPress}
                            textContentType={textContentType}
                            autoComplete={autoComplete}
                            selectTextOnFocus={selectTextOnFocus}
                            style={[styles.input, type === 'otp' && { textAlign: 'center' }]}
                            containerStyle={{ flex: 1 }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            editable={!disabled}
                            type={textType}
                            variant={type === 'otp' ? 'title_Large' : 'body_Large'}
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
                <Text variant='body_Medium' type={legendTextType}>{legend}</Text>
            )}
        </Flex>
    );
});

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
