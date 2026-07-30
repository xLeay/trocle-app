import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Button from '#/controls/Button';
import SegmentedControls from '#/controls/SegmentedControls';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import PrivateMessagesList, { SearchFilterType } from '#/messages/PrivateMessagesList';

import { Notification } from '#/icons';



const FILTER_OPTIONS: { label: string; value: SearchFilterType }[] = [
    { label: 'Tout', value: 'all' },
    { label: 'Utilisateurs', value: 'users' },
    { label: 'Messages', value: 'messages' },
];

export default function Tab() {
    const { activeTheme } = useTheme();

    const [search, setSearch] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    const { left, center, right } = useTopAppBar("_search", {
        search: search,
        setSearch: setSearch,
        placeHolder: "Recherchez dans les messages privés...",
        onFocus: () => setIsSearchActive(true),
        onBlur: () => {
            if (!search) setIsSearchActive(false);
        },
    });

    const [tabIndex, setTabIndex] = useState(0);
    const currentFilter = FILTER_OPTIONS[tabIndex].value;

    // Détermine si le mode recherche est actif (au focus ou si du texte est saisi)
    const isSearching = isSearchActive || search.trim().length > 0;

    return (
        <View style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}>
            <Stack.Screen
                options={{
                    title: 'Messages',
                    header: () =>
                        <Flex gap={activeTheme.spacing._0} direction="row" style={{
                            backgroundColor: activeTheme.colors.surface.secondary,
                            width: '100%',
                            paddingLeft: activeTheme.spacing._200,
                            paddingRight: activeTheme.spacing._100
                        }}>
                            <Flex direction='row' justifyContent='flex-start' style={{ flex: 1 }}>
                                <TopAppBar
                                    left={left}
                                    center={center}
                                    right={right}
                                    style={{
                                        paddingHorizontal: 0,
                                    }}
                                />
                            </Flex>
                            <Flex direction='row' style={{
                                height: 60,
                            }}>
                                <Button icon={<Notification />} variant="ghost" size="large" onPress={() => console.log('Notifications')} />
                            </Flex>
                        </Flex>,
                }}
            />

            {isSearching && (
                <Flex zIndex={10} style={{ paddingInline: activeTheme.spacing._200 }}>
                    <SegmentedControls
                        options={FILTER_OPTIONS.map(opt => opt.label)}
                        selectedIndex={tabIndex}
                        onChange={setTabIndex}
                    />
                </Flex>
            )}

            <PrivateMessagesList search={search} filterType={currentFilter} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
