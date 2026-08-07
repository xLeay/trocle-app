import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput as RNTextInput } from 'react-native';

import Flex from '#/Flex';
import TextInput from '#/TextInput';
import { Image, Send } from '#/icons';

interface MessageBarProps {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onImagePress?: () => void;
    onSend?: (message: string) => void;
}

const MessageBar = ({
    onChangeText,
    value = '',
    placeholder = 'Écris ton message',
    disabled = false,
    onFocus,
    onBlur,
    onImagePress,
    onSend,
}: MessageBarProps) => {
    const { activeTheme } = useTheme();
    const inputRef = useRef<RNTextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    const hasText = value.trim().length > 0;
    const isExpanded = isFocused;
    const canSend = hasText && !disabled;

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const handleSend = () => {
        const message = value.trim();

        if (!message || !onSend) {
            return;
        }

        onSend(message);
        inputRef.current?.blur();
    };

    return (
        <Flex
            direction="row"
            alignItems="flex-end"
            style={[
                styles.container,
                {
                    backgroundColor:
                        activeTheme.colors.component.messageBar.background,
                    borderRadius: isExpanded
                        ? activeTheme.radius.default
                        : styles.container.borderRadius,
                    paddingHorizontal: activeTheme.spacing._100,
                    paddingVertical: isExpanded
                        ? activeTheme.spacing._50
                        : 0,
                },
            ]}
        >
            <Flex
                direction={isExpanded ? 'column' : 'row'}
                alignItems={isExpanded ? 'stretch' : 'center'}
                style={styles.content}
            >
                <Flex
                    direction="row"
                    alignItems="center"
                    style={styles.inputRow}
                >
                    {!isExpanded && (
                        <ImageButton
                            color={activeTheme.colors.icon.primary}
                            disabled={disabled}
                            onPress={onImagePress}
                        />
                    )}

                    <Pressable
                        style={styles.inputPressable}
                        disabled={disabled}
                        onPress={() => inputRef.current?.focus()}
                    >
                        <TextInput
                            ref={inputRef}
                            placeholder={placeholder}
                            placeholderColor={activeTheme.colors.text.secondary}
                            caretColor={activeTheme.colors.text.brand}
                            value={value}
                            onChangeText={onChangeText}
                            editable={!disabled}
                            multiline={isExpanded}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            style={[
                                styles.input,
                                {
                                    color: activeTheme.colors.text.primary,
                                    textAlignVertical: isExpanded
                                        ? 'top'
                                        : 'center',
                                },
                            ]}
                            containerStyle={styles.inputContainer}
                        />
                    </Pressable>

                    {canSend && !isExpanded && (
                        <SendButton
                            color={activeTheme.colors.text.invert}
                            backgroundColor={activeTheme.colors.component.button.primary}
                            onPress={handleSend}
                        />
                    )}
                </Flex>

                {isExpanded && (
                    <Flex direction="row" justifyContent="space-between">
                        <ImageButton
                            color={activeTheme.colors.icon.primary}
                            disabled={disabled}
                            onPress={onImagePress}
                        />

                        {canSend && (
                            <SendButton
                                color={activeTheme.colors.text.invert}
                                backgroundColor={
                                    activeTheme.colors.component.button.primary
                                }
                                onPress={handleSend}
                            />
                        )}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

interface ImageButtonProps {
    color: string;
    disabled: boolean;
    onPress?: () => void;
}

const ImageButton = ({ color, disabled, onPress }: ImageButtonProps) => (
    <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter une image"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
            disabled && styles.disabled,
        ]}
    >
        <Image color={color} size={24} />
    </Pressable>
);

interface SendButtonProps {
    color: string;
    backgroundColor: string;
    onPress: () => void;
}

const SendButton = ({ color, backgroundColor, onPress }: SendButtonProps) => (
    <Pressable
        accessibilityRole="button"
        accessibilityLabel="Envoyer le message"
        onPress={onPress}
        style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor },
            pressed && styles.pressed,
        ]}
    >
        <Send color={color} size={24} />
    </Pressable>
);

export default MessageBar;

const styles = StyleSheet.create({
    container: {
        minHeight: 52,
        borderRadius: 26,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
    inputRow: {
        flex: 1,
        minHeight: 52,
    },
    inputPressable: {
        flex: 1,
        alignSelf: 'stretch',
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        flex: 1,
        minHeight: 52,
        paddingHorizontal: 8,
        paddingVertical: 0,
        fontSize: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.5,
    },
});
