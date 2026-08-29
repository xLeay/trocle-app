import { router, Stack } from 'expo-router';
import { useState } from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import SearchBar from '#/bars/SearchBar';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import NextTrocsList from '#/troc/NextTrocsList';
import { MOCK_TROCS } from '@/src/mock/trocs.mock';

import { Arrowleft } from '#/icons';

export default function NextTrocs() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Prochains trocs',
    });

    const [search, setSearch] = useState('');

    const trocsList = MOCK_TROCS;
    const nextTrocs = trocsList.filter((troc) => troc.status === 'accepted');

    const normalize = (value: string) =>
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

    const filteredNextTrocs = nextTrocs.filter((troc) => {
        const query = normalize(search);

        const searchableValues = [
            troc.username_initiator,
            troc.username_recipient,
            troc.location_troc,
            troc.troc_delivery_method === 'hand_delivery'
                ? 'main propre'
                : 'point relais',
        ];

        return searchableValues.some((value) =>
            normalize(value).includes(query),
        );
    });

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            {/* Content */}
            <Flex
                fullWidth
                gap={activeTheme.spacing._100}
                style={{
                    height: 500,
                    backgroundColor: activeTheme.colors.surface.secondary
                }}>
                {/* Top */}
                <Flex
                    style={{
                        backgroundColor: activeTheme.colors.surface.secondary,
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingTop: activeTheme.spacing._0,
                        paddingBottom: activeTheme.spacing._200,
                        borderBottomWidth: 1,
                        borderBottomColor: activeTheme.colors.border.primary
                    }}
                >
                    <SearchBar
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Utilisateur, Article...'
                    />
                </Flex>

                {/* Section de Trocs */}
                <Flex fullWidth gap={activeTheme.spacing._400}>
                    {/* Prochains Trocs */}
                    <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingBottom: activeTheme.spacing._100 }}>
                        {/* Label section */}
                        <Flex
                            fullWidth
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            style={{ paddingHorizontal: activeTheme.spacing._200 }}
                        >
                            <Text variant='body_Medium' type='secondary'>{nextTrocs.length} résultats</Text>
                        </Flex>

                        {/* Trocs (cards) */}
                        <Flex
                            fullWidth
                            direction='column'
                            gap={activeTheme.spacing._200}
                            style={{ height: '100%' }}
                        >
                            <NextTrocsList
                                label="Prochains trocs"
                                trocs={filteredNextTrocs}
                                horizontal={false}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </CustomSafeAreaView>
    );
}

