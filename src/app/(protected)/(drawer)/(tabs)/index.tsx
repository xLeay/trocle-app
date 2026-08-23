import { useCallback } from 'react';
import {
    StyleSheet,
    useWindowDimensions,
} from 'react-native';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import ButtonTroc from '#/controls/ButtonTroc';
import { Product } from '#/product/HomeProductCard';

import DeckLayer from '@/src/features/home/deck/DeckLayer';
import {
    CardLayer,
    SwipeAction,
} from '@/src/features/home/deck/deck.config';
import { useProductDeck } from '@/src/features/home/deck/useProductDeck';
import { useTheme } from '@/src/lib/hooks/useTheme';


export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'pull-calvin-klein',
        title: 'Pull blanc',
        brand: 'Calvin Klein',
        seller: 'Shuri',
        distance: '2,3 km',
        state: 'Bon état',
        trocoins: 800,
        images: [
            'https://images1.vinted.net/t/06_009c7_CK8akpyqmiiHQHBJVgisdniY/f800/1781207271.webp?s=5e7a319cd598d463327e6f4dc548a5e0c925c45b',
            'https://images1.vinted.net/t/06_02478_S5x1B4aq7JJTEufrGmpWnT89/f800/1781207271.webp?s=53eb7feb6b0321bfd37dedb054f839e9e4f9bd54',
            'https://images1.vinted.net/t/05_022a2_hUVNxBLDEeSTbPM7HH9qzCFX/f800/1781207271.webp?s=856cf400488f29b9b21efd462bb0be838c744e90',
        ],
    },
    {
        id: 'veste-jean',
        title: 'Veste en jean',
        brand: 'Levi’s',
        seller: 'Maya',
        distance: '1,1 km',
        state: 'Très bon état',
        trocoins: 950,
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=85',
        ],
    },
    {
        id: 'sac-cuir',
        title: 'Sac en cuir',
        brand: 'Mango',
        seller: 'Lina',
        distance: '4,8 km',
        state: 'Bon état',
        trocoins: 650,
        images: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
        ],
    },
    {
        id: 'baskets',
        title: 'Baskets blanches',
        brand: 'Nike',
        seller: 'Noah',
        distance: '3,2 km',
        state: 'Comme neuf',
        trocoins: 1200,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
        ],
    },
];

const CARD_LAYERS: CardLayer[] = ['a', 'b'];

export default function Tab() {
    const { activeTheme } = useTheme();

    const {
        width: screenWidth,
        height: screenHeight,
    } = useWindowDimensions();

    const handleAction = useCallback(
        (
            product: Product,
            action: SwipeAction
        ) => {
            console.log({
                productId: product.id,
                action,
            });

            // Plus tard :
            // mutation.mutate({
            //     productId: product.id,
            //     action,
            // });
        },
        []
    );

    const deck = useProductDeck({
        products: MOCK_PRODUCTS,
        screenWidth,
        screenHeight,
        onAction: handleAction,
    });

    if (!deck.hasProducts) {
        return (
            <Flex
                alignItems='center'
                justifyContent='center'
                gap={activeTheme.spacing._200}
                style={[
                    styles.container,
                    {
                        backgroundColor: activeTheme.colors.surface.secondary,
                        paddingHorizontal: activeTheme.spacing._200,
                    },
                ]}
            >
                <Text type='primary' variant='body_Large'>Aucun produit à proposer.</Text>
                <Flex gap={activeTheme.spacing._100}>
                    <Text type='secondary' variant='body_Medium'>Tu peux essayer de changer tes préférences</Text>
                    <Button variant='tertiary' size='small' onPress={() => { }} label='Changer mes préférences' />
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex
            style={[
                styles.container,
                {
                    backgroundColor: activeTheme.colors.surface.secondary,
                    paddingHorizontal: activeTheme.spacing._200,
                },
            ]}
        >
            <Flex
                style={[
                    styles.deck,
                    {
                        borderRadius:
                            activeTheme.radius.modal,
                    },
                ]}
            >
                {CARD_LAYERS.map(layerName => {
                    const layer =
                        deck.layers[layerName];

                    if (!layer.product) {
                        return null;
                    }

                    return (
                        <DeckLayer
                            key={layerName}
                            product={layer.product}
                            productKey={
                                `${layerName}-${layer.product.id}`
                            }
                            isFront={layer.isFront}
                            gesture={layer.gesture}
                            animatedStyle={layer.motion.animatedStyle}
                            activeTheme={activeTheme}
                            imageIndex={
                                deck.carousel
                                    .currentImageIndex
                            }
                            progress={
                                deck.carousel.progress
                            }
                            onPrevious={
                                deck.carousel.goToPrevious
                            }
                            onNext={
                                deck.carousel.goToNext
                            }
                        />
                    );
                })}
            </Flex>

            {deck.hasProducts && (
                <Flex
                    alignItems="center"
                    style={[
                        styles.actions,
                        {
                            paddingVertical:
                                activeTheme.spacing._200,
                        },
                    ]}
                >
                    <Flex
                        direction="row"
                        gap={activeTheme.spacing._400}
                    >
                        <ButtonTroc
                            type="pass"
                            color="default"
                            onPress={() =>
                                deck.dismissCurrentCard(
                                    'pass'
                                )
                            }
                        />

                        <ButtonTroc
                            type="reroll"
                            color="default"
                            onPress={() =>
                                deck.dismissCurrentCard(
                                    'reroll'
                                )
                            }
                        />

                        <ButtonTroc
                            type="like"
                            color="default"
                            onPress={() =>
                                deck.dismissCurrentCard(
                                    'like'
                                )
                            }
                        />
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    deck: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    actions: {
        width: '100%',
    },
});