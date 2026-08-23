import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useReducer,
} from 'react';
import {
    cancelAnimation,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Product } from '#/product/HomeProductCard';

import {
    CardLayer,
    getOtherLayer,
    HEIGHT_MULTIPLIER,
    NEXT_CARD_SCALE,
    SCALE_DURATION,
    SWIPE_DURATION,
    SwipeAction,
    WIDTH_MULTIPLIER,
} from './deck.config';
import { useCardMotion } from './useCardMotion';
import { useCardPanGesture } from './useCardPanGesture';
import { useImageCarousel } from './useImageCarousel';

interface DeckState {
    frontLayer: CardLayer;
    productIndexes: Record<CardLayer, number>;
    layerToReset: CardLayer | null;
}

type DeckAction =
    | {
        type: 'completeSwipe';
        leavingLayer: CardLayer;
        productCount: number;
    }
    | {
        type: 'resetComplete';
    }
    | {
        type: 'resetProducts';
        productCount: number;
    };

const createInitialState = (
    productCount: number
): DeckState => ({
    frontLayer: 'a',
    productIndexes: {
        a: 0,
        b: productCount > 1 ? 1 : 0,
    },
    layerToReset: null,
});

const deckReducer = (
    state: DeckState,
    action: DeckAction
): DeckState => {
    switch (action.type) {
        case 'completeSwipe': {
            if (action.productCount === 0) {
                return state;
            }

            const incomingLayer = getOtherLayer(
                action.leavingLayer
            );

            return {
                frontLayer: incomingLayer,
                productIndexes: {
                    ...state.productIndexes,
                    [action.leavingLayer]:
                        (
                            state.productIndexes[incomingLayer] + 1
                        ) % action.productCount,
                },
                layerToReset: action.leavingLayer,
            };
        }

        case 'resetComplete':
            return {
                ...state,
                layerToReset: null,
            };

        // TODO: Mettre à jour quand les produits viendront de Supabase, il faudra distinguer :
        // - l’ajout de produits à la fin du deck ;
        // - le remplacement complet de la sélection ;
        // - la suppression d’un produit déjà affiché.
        // Il ne faut pas automatiquement réinitialiser le deck à chaque changement de référence du tableau, car React Query pourrait fournir un nouveau tableau sans que son contenu ait réellement changé.
        case 'resetProducts':
            return createInitialState(action.productCount);

        default:
            return state;
    }
};

interface UseProductDeckParams {
    products: Product[];
    screenWidth: number;
    screenHeight: number;
    onAction?: (
        product: Product,
        action: SwipeAction
    ) => void;
}

export const useProductDeck = ({
    products,
    screenWidth,
    screenHeight,
    onAction,
}: UseProductDeckParams) => {
    const [state, dispatch] = useReducer(
        deckReducer,
        products.length,
        createInitialState
    );

    const isCardExiting = useSharedValue(false);

    const cardA = useCardMotion(1, screenWidth);
    const cardB = useCardMotion(
        NEXT_CARD_SCALE,
        screenWidth
    );

    const motions = useMemo(
        () => ({
            a: cardA,
            b: cardB,
        }),
        [cardA, cardB]
    );

    const currentProduct =
        products[state.productIndexes[state.frontLayer]];

    const carousel = useImageCarousel({
        productId: currentProduct?.id,
        imageCount: currentProduct?.images.length ?? 0,
    });

    const completeSwipe = useCallback(
        (
            leavingLayer: CardLayer,
            action: SwipeAction
        ) => {
            const leavingProduct =
                products[state.productIndexes[leavingLayer]];

            if (leavingProduct) {
                onAction?.(leavingProduct, action);
            }

            carousel.reset();

            dispatch({
                type: 'completeSwipe',
                leavingLayer,
                productCount: products.length,
            });
        },
        [
            products,
            state.productIndexes,
            carousel.reset,
            onAction,
        ]
    );

    const panGestureA = useCardPanGesture({
        layer: 'a',
        enabled:
            state.frontLayer === 'a' &&
            products.length > 0,
        screenWidth,
        motion: cardA,
        nextCardScale: cardB.scale,
        imageProgress: carousel.progress,
        isCardExiting,
        restartImageProgress: carousel.restart,
        onComplete: completeSwipe,
    });

    const panGestureB = useCardPanGesture({
        layer: 'b',
        enabled:
            state.frontLayer === 'b' &&
            products.length > 0,
        screenWidth,
        motion: cardB,
        nextCardScale: cardA.scale,
        imageProgress: carousel.progress,
        isCardExiting,
        restartImageProgress: carousel.restart,
        onComplete: completeSwipe,
    });

    const dismissCurrentCard = useCallback(
        (action: SwipeAction) => {
            if (
                isCardExiting.value ||
                products.length === 0
            ) {
                return;
            }

            isCardExiting.value = true;
            cancelAnimation(carousel.progress);

            const leavingLayer = state.frontLayer;
            const incomingLayer =
                getOtherLayer(leavingLayer);

            const leavingMotion = motions[leavingLayer];
            const incomingMotion = motions[incomingLayer];

            incomingMotion.scale.value = withTiming(1, {
                duration: SCALE_DURATION,
            });

            if (action === 'reroll') {
                leavingMotion.translateY.value = withTiming(
                    screenHeight * HEIGHT_MULTIPLIER,
                    { duration: SWIPE_DURATION },
                    finished => {
                        if (finished) {
                            scheduleOnRN(
                                completeSwipe,
                                leavingLayer,
                                action
                            );
                        }
                    }
                );

                return;
            }

            const exitPosition =
                action === 'like'
                    ? screenWidth * WIDTH_MULTIPLIER
                    : -screenWidth * WIDTH_MULTIPLIER;

            leavingMotion.translateX.value = withTiming(
                exitPosition,
                { duration: SWIPE_DURATION },
                finished => {
                    if (finished) {
                        scheduleOnRN(
                            completeSwipe,
                            leavingLayer,
                            action
                        );
                    }
                }
            );
        },
        [
            products.length,
            state.frontLayer,
            screenWidth,
            screenHeight,
            motions,
            carousel.progress,
            isCardExiting,
            completeSwipe,
        ]
    );

    useLayoutEffect(() => {
        if (!state.layerToReset) {
            return;
        }

        const motion = motions[state.layerToReset];

        motion.translateX.value = 0;
        motion.translateY.value = 0;
        motion.scale.value = NEXT_CARD_SCALE;

        isCardExiting.value = false;

        dispatch({
            type: 'resetComplete',
        });
    }, [
        state.layerToReset,
        motions,
        isCardExiting,
    ]);

    const layers = {
        a: {
            product:
                products[state.productIndexes.a],
            isFront: state.frontLayer === 'a',
            motion: cardA,
            gesture: panGestureA,
        },
        b: {
            product:
                products[state.productIndexes.b],
            isFront: state.frontLayer === 'b',
            motion: cardB,
            gesture: panGestureB,
        },
    };

    return {
        hasProducts: products.length > 0,
        layers,
        carousel,
        dismissCurrentCard,
    };
};