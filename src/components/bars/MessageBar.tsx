import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import { Keyboard, Pressable, TextInput as RNTextInput, StyleSheet } from 'react-native';

// Composants
import Button from '#/controls/Button';
import Flex from '#/Flex';
import TextInput from '#/TextInput';

// Icones
import { Arrowtop, Image, Send } from '#/icons';

type MessageBarVariant = 'default' | 'match';

interface MessageBarProps {
    variant?: MessageBarVariant;
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
    variant = 'default',
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
    const [isFocused, setIsFocused] = React.useState(false);

    const isMatch = variant === 'match';

    const handleFocus = () => { onFocus?.(); setIsFocused(true); };
    const handleBlur = () => { onBlur?.(); setIsFocused(false); };
    const handleSend = () => {
        if (typeof onSend === 'function') onSend(value);
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const isExpanded = isFocused; // default/filled -> compact ; focused/filled_focused -> expanded
    // En mode match, le bouton Send est toujours présent (désactivé si vide)
    const showSend = isMatch || value.length > 0;
    const canSend = value.trim().length > 0;

    // Pas de bouton image en mode match
    const iconEl = !isMatch ? (
        <Button
            key="icon"
            icon={<Image color={activeTheme.colors.icon.primary} />}
            variant="ghost"
            size="large"
            onPress={onImagePress}
        />
    ) : null;

    const inputEl = (
        <TextInput
            key="input"
            ref={inputRef}
            placeholder={placeholder}
            placeholderColor={activeTheme.colors.text.secondary}
            caretColor={isMatch ? activeTheme.colors.text.primary : activeTheme.colors.text.brand}
            value={value}
            onChangeText={onChangeText}
            style={[styles.input, {
                paddingLeft: (isExpanded || isMatch) ? activeTheme.spacing._100 : 0,
                marginRight: isExpanded ? 0 : activeTheme.spacing._100
            }]}
            containerStyle={{ flex: isExpanded ? 0 : 1 }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            multiline={isExpanded}
        />
    );

    const sendEl = showSend ? (
        <Button
            key="send"
            icon={isMatch ? <Arrowtop /> : <Send />}
            variant={isMatch ? 'secondary' : 'primary'}
            size="large"
            onPress={handleSend}
            disabled={!canSend}
        />
    ) : null;


    const componentColor = isMatch ?
        activeTheme.colors.surface.primary :
        activeTheme.colors.component.messageBar.background;


    useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsFocused(false);
            onBlur?.();
            inputRef.current?.blur();
        });
        return () => {
            hideSubscription.remove();
        };
    }, [onBlur]);

    return (
        <Pressable
            onPress={() => {
                inputRef.current?.focus();
                setIsFocused(true);
            }}
            style={styles.container}
        >
            <Flex
                direction={isExpanded ? 'column' : 'row'}
                alignItems={isExpanded ? 'stretch' : 'center'}
                style={[styles.inner, {
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: activeTheme.colors.border.brand,
                    backgroundColor: componentColor,
                    paddingHorizontal: activeTheme.spacing._100,
                    paddingBottom: isExpanded ? activeTheme.spacing._100 : 0
                }]}
            >
                {isExpanded ? (
                    <>
                        {inputEl}
                        <Flex
                            // border
                            borderColor='red'
                            key="actions" direction="row" alignItems="center" style={styles.actionsRow}
                        >
                            {!isMatch ? iconEl : <Flex />}
                            {sendEl}
                        </Flex>
                    </>
                ) : (
                    <>
                        {iconEl}
                        {inputEl}
                        {sendEl}
                    </>
                )}
            </Flex>
        </Pressable>
    );
};

export default MessageBar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inner: {
        minHeight: 52,
        borderRadius: 26,

        // borderWidth: 1,
    },
    actionsRow: {
        justifyContent: 'space-between',
    },
    input: {
        // height: 52,
        maxHeight: 96,

        includeFontPadding: false,
        textAlignVertical: 'center',

        // borderWidth: 1,
    },
});
