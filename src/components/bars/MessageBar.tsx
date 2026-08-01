import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useRef } from 'react';
import { Pressable, TextInput as RNTextInput, StyleSheet } from 'react-native';

// Composants
import Button from '#/controls/Button';
import Flex from '#/Flex';
import TextInput from '#/TextInput';

// Icones
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
    placeholder = 'Recherche',
    disabled = false,
    onFocus,
    onBlur,
    onImagePress,
    onSend,
}: MessageBarProps) => {
    const { activeTheme } = useTheme();
    const inputRef = useRef<RNTextInput>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
        onFocus?.()
        setIsFocused(true)
    };

    const handleBlur = () => {
        onBlur?.()
        setIsFocused(false)
    };

    const handleSend = () => {
        if (typeof onSend === 'function') {
            onSend(value);
        }
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const state =
        value && value.length > 0 && isFocused ? 'filled_focused' :
            value && value.length > 0 ? 'filled' :
                isFocused ? 'focused' :
                    'default';


    const isExpanded = state === 'focused' || state === 'filled_focused';
    const showSend = state === 'filled' || state === 'filled_focused';

    return (
        <Flex direction='row' border borderColor='red' gap={0} style={[styles.container]}>
            <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                    setIsFocused(true);
                }}
            >
                <Flex
                    border
                    borderColor='blue'
                    direction='row'
                    alignItems='center'
                    style={[styles.inputContainer, { backgroundColor: activeTheme.colors.component.messageBar.background, paddingLeft: activeTheme.spacing._100 }]}
                >
                    <Button icon={<Image color={activeTheme.colors.icon.primary} />} variant="ghost" size="large" onPress={() => { console.log("hello"); }} />
                    <TextInput
                        ref={inputRef}
                        placeholder={placeholder}
                        placeholderColor={activeTheme.colors.text.secondary}
                        caretColor={activeTheme.colors.text.brand}
                        value={value}
                        onChangeText={onChangeText}
                        style={[styles.input]}
                        containerStyle={{ flex: 1 }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        editable={!disabled}
                    />
                </Flex>

            </Pressable>
        </Flex>
    );
}

export default MessageBar;

const styles = StyleSheet.create({
    container: {
        // height: 52,
        // flex: 1,
        alignContent: 'center',
        // width: '100%',
    },
    inputContainer: {
        height: 52,
        borderRadius: 52 / 2,
        flex: 1,
    },
    input: {
        height: '100%',
        padding: -1,
        borderWidth: 1,
        borderColor: 'green',

    },
});
