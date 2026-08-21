import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Avatar from '#/display/Avatar';
import ImageRatio, { RATIO_PRESETS } from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft, Close, Heart } from '#/icons';


const MOCK_HISTORY = [
    {
        id: '1',
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        isLiked: true,
        isUser: false
    },
    {
        id: '2',
        image: 'https://images1.vinted.net/t/05_0188b_Pdri63RThMRyXVduoVEeR1TK/f800/1787319318.webp?s=2c71abc91cc2e16a08a0d57cc9ffb59cb9774c5b',
        isLiked: true,
        isUser: false
    },
    {
        id: '3',
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        isLiked: true,
        isUser: false
    },
    {
        id: '4',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=rose',
        isUser: true
    },
    {
        id: '5',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=flora',
        isUser: true
    },
    {
        id: '6',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=amelia',
        isUser: true
    },
    {
        id: '7',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=chloe',
        isUser: true
    },
    {
        id: '8',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=emma',
        isUser: true
    },
    {
        id: '9',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=mia',
        isUser: true
    },
    {
        id: '10',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=olivia',
        isUser: true
    },
    {
        id: '11',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=ava',
        isUser: true
    },
    {
        id: '12',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=isla',
        isUser: true
    },
    {
        id: '13',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=lucy',
        isUser: true
    },
    {
        id: '14',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=lily',
        isUser: true
    },
    {
        id: '15',
        image: 'https://api.dicebear.com/10.x/dylan/svg?seed=ava',
        isUser: true
    },
]

export default function History() {

    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Historique',
    });


    const [history, setHistory] = useState(MOCK_HISTORY);

    const amountResults = history.length;

    const handleRemoveFromHistory = (id: string) => {
        setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
        // TODO: supabase
    };

    const handleClearHistory = () => {
        Alert.alert('Effacer l\'historique', 'Voulez-vous vraiment effacer l\'historique ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Effacer', onPress: () => setHistory([]), style: 'destructive' }
        ]);
    };

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                fullWidth
                left={left}
                center={center}
                right={right}
            />

            <Flex fullWidth style={styles.container}>
                <FlashList
                    data={history}
                    numColumns={2}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={{
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingTop: activeTheme.spacing._200,
                        paddingBottom: activeTheme.spacing._400,
                    }}
                    style={{ width: '100%' }}
                    ListHeaderComponent={
                        <Flex direction='row' justifyContent='space-between' alignItems='center' style={{ marginBottom: activeTheme.spacing._200 }}>
                            <Text variant='title_Small' type='primary'>{amountResults} résultat{amountResults > 1 ? 's' : ''}</Text>
                            {history.length > 0 && <Text variant='title_Small' type='brand' onPress={handleClearHistory}>Effacer l'historique</Text>}
                        </Flex>
                    }
                    renderItem={({ item, index }) => (
                        <Flex
                            fullWidth
                            gap={activeTheme.spacing._50}
                            style={{
                                flex: 1,
                                paddingRight: index % 2 === 0 ? activeTheme.spacing._100 : 0,
                                paddingLeft: index % 2 !== 0 ? activeTheme.spacing._100 : 0,
                                marginBottom: activeTheme.spacing._200
                            }}
                        >
                            {/* Image */}
                            <Flex fullWidth overflow='hidden' style={{ borderRadius: activeTheme.radius.default, position: 'relative' }}>
                                {item.isUser ? (
                                    <Flex
                                        border
                                        borderColor={activeTheme.colors.border.primary}
                                        borderWidth={2}
                                        fullWidth
                                        alignItems='center'
                                        justifyContent='center'
                                        style={{ aspectRatio: RATIO_PRESETS.cover, borderRadius: activeTheme.radius.default }}
                                    >
                                        <Avatar
                                            size='enormous'
                                            customImage={item.image}
                                        />
                                    </Flex>
                                ) : (
                                    <ImageRatio ratio='cover' source={item.image} />
                                )}
                                <Flex style={{ position: 'absolute', right: activeTheme.spacing._100, top: activeTheme.spacing._100, zIndex: 999 }}>
                                    <Button
                                        variant={'transparent'}
                                        size='small'
                                        icon={<Close />}
                                        onPress={() => handleRemoveFromHistory(item.id)}
                                    />
                                </Flex>

                                {!item.isUser && (
                                    <Flex style={{ position: 'absolute', right: activeTheme.spacing._100, bottom: activeTheme.spacing._100, zIndex: 999 }}>
                                        <Button
                                            variant={item.isLiked ? 'gradient' : 'transparent'}
                                            size='small'
                                            icon={<Heart filled={item.isLiked} />}
                                            onPress={() => alert('J\'aime')}
                                        />
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                    )}
                />
            </Flex>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
    },
});