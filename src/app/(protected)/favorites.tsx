import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Arrowleft, Heart, Trocoin } from '#/icons';


const ARTICLES = [
    {
        image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
        title: 'Xbox 360',
        brand: 'Microsoft',
        trocValue: 5000,
        isLiked: true,
    },
    {
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Piano électrique petite taille',
        brand: 'Sans marque',
        trocValue: 7000,
        isLiked: true,
    },
    {
        image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
        title: 'Piano électrique petite taille',
        brand: 'Sans marque',
        trocValue: 7000,
        isLiked: true,
    },
]

export default function Favorites() {

    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Favoris',
    });


    const amountArticles = ARTICLES.length;

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
                    data={ARTICLES}
                    numColumns={2}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                    contentContainerStyle={{
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingTop: activeTheme.spacing._200,
                        paddingBottom: activeTheme.spacing._400,

                    }}
                    style={{ width: '100%' }}
                    ListHeaderComponent={
                        <Flex style={{ marginBottom: activeTheme.spacing._200 }}>
                            <Text variant='title_Small' type='primary'>{amountArticles} Articles</Text>
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
                                <ImageRatio ratio='cover' source={item.image} />
                                <Flex style={{ position: 'absolute', right: activeTheme.spacing._100, bottom: activeTheme.spacing._100, zIndex: 999 }}>
                                    <Button
                                        variant={item.isLiked ? 'gradient' : 'transparent'}
                                        size='small'
                                        icon={<Heart filled={item.isLiked} />}
                                        onPress={() => alert('J\'aime')}
                                    />
                                </Flex>
                            </Flex>
                            {/* Infos */}
                            <Flex gap={0}>
                                <Text variant='label_Large'>{item.title}</Text>
                                <Text variant='body_Small' type='secondary'>{item.brand}</Text>
                                <Flex direction='row' gap={0} justifyContent='center'>
                                    <Text variant='body_Small' type='secondary'>Estimé à {item.trocValue}</Text>
                                    <Trocoin size={16} color={activeTheme.colors.text.secondary} />
                                </Flex>
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