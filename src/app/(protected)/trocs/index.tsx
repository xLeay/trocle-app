import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import SearchBar from '#/bars/SearchBar';
import BadgeNotification from '#/display/BadgeNotification';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import AllTrocsList from '#/troc/AllTrocsList';
import NextTrocsList from '#/troc/NextTrocsList';

import { MOCK_TROCS } from '@/src/mock/trocs.mock';

import { Arrowleft, Chevronright } from '#/icons';
import PressableOverlay from '@/src/components/controls/PressableOverlay';

export default function Trocs() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Mes trocs',
    });

    const [search, setSearch] = useState('');

    const trocsList = MOCK_TROCS;
    const nextTrocs = trocsList.filter((troc) => troc.status === 'accepted');
    const lastThreeTrocs = trocsList.slice(0, 3);

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
            <ScrollView
                style={{ backgroundColor: activeTheme.colors.surface.secondary, flex: 1 }}
                contentContainerStyle={{ gap: activeTheme.spacing._100 }}
                stickyHeaderIndices={[0]}
                bounces={false}
                overScrollMode='never'
            >
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
                            {/* Gauche */}
                            <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                <Text variant='title_Medium' type='primary'>Prochains trocs</Text>
                                <BadgeNotification label={nextTrocs.length} />
                            </Flex>

                            {/* Droite */}
                            <PressableOverlay onPress={() => router.push('/trocs/next-trocs')}>
                                <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                    <Text variant='body_Large' type='primary'>Tout voir</Text>
                                    <Chevronright color={activeTheme.colors.text.primary} />
                                </Flex>
                            </PressableOverlay>
                        </Flex>

                        {/* Trocs (cards) */}
                        <Flex
                            fullWidth
                            direction='row'
                            overflow='visible'
                            gap={activeTheme.spacing._200}
                            style={{ height: 220 }}
                        >
                            <NextTrocsList
                                trocs={nextTrocs}
                            />
                        </Flex>
                    </Flex>

                    {/* Liste des Trocs */}
                    <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingBottom: activeTheme.spacing._100 }}>
                        {/* Label section */}
                        <Flex
                            fullWidth
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            style={{ paddingHorizontal: activeTheme.spacing._200 }}
                        >
                            {/* Gauche */}
                            <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                <Text variant='title_Medium' type='primary'>Liste des Trocs</Text>
                            </Flex>

                            {/* Droite */}
                            <PressableOverlay onPress={() => router.push('/trocs/trocs-list')}>
                                <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                                    <Text variant='body_Large' type='primary'>Tout voir</Text>
                                    <Chevronright color={activeTheme.colors.text.primary} />
                                </Flex>
                            </PressableOverlay>
                        </Flex>

                        {/* Trocs (feed) */}
                        <Flex
                            fullWidth
                            direction='row'
                            overflow='visible'
                            gap={activeTheme.spacing._200}
                            style={{
                                height: 220,
                                borderTopWidth: 1,
                                borderTopColor: activeTheme.colors.border.primary
                            }}
                        >
                            <AllTrocsList trocs={lastThreeTrocs} />
                        </Flex>
                    </Flex>
                </Flex>
            </ScrollView>
        </CustomSafeAreaView>
    );
}

