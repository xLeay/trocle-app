import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    SharedValue,
} from 'react-native-reanimated';

import HomeProductCard, { Product } from '#/product/HomeProductCard';

interface DeckLayerProps {
    product: Product;
    productKey: string;
    isFront: boolean;
    gesture: ComponentProps<typeof GestureDetector>['gesture'];
    animatedStyle: ComponentProps<typeof Animated.View>['style'];
    activeTheme: ComponentProps<typeof HomeProductCard>['activeTheme'];
    imageIndex: number;
    progress: SharedValue<number>;
    onPrevious: () => void;
    onNext: () => void;
}

const DeckLayer = ({
    product,
    productKey,
    isFront,
    gesture,
    animatedStyle,
    activeTheme,
    imageIndex,
    progress,
    onPrevious,
    onNext,
}: DeckLayerProps) => {
    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                pointerEvents={
                    isFront ? 'auto' : 'none'
                }
                style={[
                    StyleSheet.absoluteFill,
                    animatedStyle,
                    {
                        zIndex: isFront ? 2 : 1,
                    },
                ]}
            >
                <HomeProductCard
                    key={productKey}
                    product={product}
                    imageIndex={
                        isFront ? imageIndex : 0
                    }
                    activeTheme={activeTheme}
                    progress={
                        isFront ? progress : undefined
                    }
                    onPrevious={
                        isFront ? onPrevious : undefined
                    }
                    onNext={
                        isFront ? onNext : undefined
                    }
                />
            </Animated.View>
        </GestureDetector>
    );
};

export default DeckLayer;