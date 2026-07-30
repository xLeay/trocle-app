import { useTheme } from '@/src/lib/hooks/useTheme';
import React, { useRef } from 'react';
import { Pressable, TextInput as RNTextInput, StyleSheet } from 'react-native';

// Composants
import Button from '#/controls/Button';
import Flex from '#/Flex';
import TextInput from '#/TextInput';

// Icones
import { Closecircle, Search } from '#/icons';


interface SearchBarProps {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

const SearchBar = ({
    onChangeText,
    value = '',
    placeholder = 'Recherche',
    disabled = false,
    onFocus,
    onBlur,
}: SearchBarProps) => {
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

    const handleCancel = () => {
        if (typeof onChangeText === 'function') {
            onChangeText('');
        }
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleCrossPress = () => {
        if (typeof onChangeText === 'function') {
            onChangeText('');
        }
    }

    const state =
        value && value.length > 0 ? 'filled' :
            isFocused ? 'focused' :
                'default';

    const isFilled = state === 'filled';
    const searchColor = isFilled
        ? activeTheme.colors.text.primary
        : activeTheme.colors.text.placeholder;

    return (
        <Flex direction='row' gap={0} style={[styles.container]}>
            <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                    setIsFocused(true);
                }}
            >
                <Flex direction='row' alignItems='center' style={[styles.inputContainer, { backgroundColor: activeTheme.colors.component.searchBar.background }]}>
                    <Flex direction='row' alignItems='center' gap={8} style={[styles.left]}>
                        <Search color={searchColor} />
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
                        />
                    </Flex>

                    {state === 'filled' && (
                        <Pressable onPress={handleCrossPress}>
                            <Closecircle color={activeTheme.colors.surface.field} />
                        </Pressable>
                    )}
                </Flex>

                {state !== 'default' && (
                    <Button
                        label="Annuler"
                        variant="ghost"
                        size="small"
                        onPress={handleCancel}
                    />
                )}

            </Pressable>
        </Flex>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        height: 45,
        flex: 1,
        alignContent: 'center',
    },
    inputContainer: {
        borderRadius: 23,
        paddingRight: 12,
        flex: 1,
    },
    left: {
        flexDirection: 'row',
        paddingLeft: 12,
        flex: 1,
    },
    input: {
        // flex: 1,
    },
});
