import { FlashList } from '@shopify/flash-list';
import { useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { useTheme } from '@/src/lib/hooks/useTheme';
import { Product } from "@/src/types/product";

import Flex from "#/Flex";
import Text from "#/Text";
import Button from '#/controls/Button';
import ImagePagination from '#/controls/ImagePagination';
import PressableOverlay from "#/controls/PressableOverlay";
import ImageRatio, { RATIO_PRESETS } from '#/display/ImageRatio';

import { Certification, Heart, State3 } from '@/src/components/icons';


interface ProductsBlockProps {
    item: Product
    liked: boolean;
    onToggleLike: () => void;
    onPressProduct: () => void;
}

const ProductsBlock: React.FC<ProductsBlockProps> = ({
    item,
    liked,
    onToggleLike,
    onPressProduct
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    });

    const { activeTheme } = useTheme();

    const { width: windowWidth } = useWindowDimensions();
    const horizontalPadding = activeTheme.spacing._200 * 2;
    const imageWidth = windowWidth - horizontalPadding;
    const imageHeight = imageWidth / RATIO_PRESETS['cover'];

    return (
        <Flex
            // border
            borderColor="blue"
            gap={activeTheme.spacing._100}
            style={{
                width: '100%',
                flex: 1,

            }}>
            <PressableOverlay onPress={onPressProduct} android_ripple={{ foreground: true }} style={{
                // borderWidth: 1,
                borderColor: 'red',
                paddingHorizontal: activeTheme.spacing._200,
            }}>

                {/* Carrousel d’images horizontal */}
                <View style={{
                    width: '100%',
                    height: imageHeight,
                    borderRadius: activeTheme.radius.modal,
                    overflow: 'hidden',
                    borderWidth: 0.5,
                    borderColor: activeTheme.colors.border.primary35
                }}>
                    <FlashList
                        data={item.images}
                        horizontal
                        // pagingEnabled

                        snapToInterval={imageWidth}
                        snapToAlignment='center'

                        decelerationRate={'normal'}
                        disableIntervalMomentum={true}
                        bounces={false}
                        overScrollMode='never'

                        keyExtractor={(uri, index) => `${item.id}-img-${index}`}
                        onViewableItemsChanged={viewableItemsChanged.current}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item: imageUri }) => (
                            <Flex style={{ width: imageWidth, height: imageHeight }}>
                                <ImageRatio
                                    transition={250}
                                    ratio={'cover'}
                                    source={{ uri: imageUri }}
                                    onPress={onPressProduct}
                                    style={{ width: imageWidth }}
                                />
                            </Flex>
                        )}
                    />

                    {/* Dots pagination */}
                    <Flex style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        bottom: activeTheme.spacing._200,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <ImagePagination
                            total={item.images.length}
                            currentIndex={currentImageIndex}
                            type="dot"
                        />
                    </Flex>

                    {/* Temps du post */}
                    <Flex style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        left: activeTheme.spacing._200,
                        top: activeTheme.spacing._200,
                        backgroundColor: activeTheme.colors.surface.transparent,
                        paddingHorizontal: activeTheme.spacing._100,
                        paddingVertical: activeTheme.spacing._50,
                        borderRadius: activeTheme.radius.card,
                    }}>
                        <Text variant="label_Small" type="invert">12h</Text>
                    </Flex>

                    {/* Bouton like */}
                    <Flex style={{
                        position: 'absolute',
                        right: activeTheme.spacing._200,
                        top: activeTheme.spacing._200,
                    }}>
                        <Button
                            icon={<Heart filled={liked} />}
                            variant={liked ? "gradient" : 'transparent'}
                            size="large"
                            onPress={onToggleLike}
                        />
                    </Flex>
                </View>

                {/* Infos article */}
                <Flex>
                    {/* Top */}
                    <Flex direction="row" justifyContent="space-between" style={{ width: '100%' }}>

                        <Flex style={{ flex: 1, marginRight: activeTheme.spacing._100 }}>
                            <Text
                                variant="title_Small"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >{item.title}</Text>
                        </Flex>
                        <Flex direction="row" gap={activeTheme.spacing._50} alignItems='center'>
                            <Text variant="body_Small" type="secondary">Bon état</Text>
                            <State3 color={activeTheme.colors.text.secondary} />
                        </Flex>
                    </Flex>

                    <Text variant="body_Small" type="secondary">Nintendo</Text>

                    {/* Détenteur de l'article */}
                    <Flex direction="row" alignItems='center'>
                        <Text variant="body_Small" type="secondary">Shuri</Text>
                        <Certification filled color={activeTheme.colors.icon.brand} />
                    </Flex>
                </Flex>
            </PressableOverlay>
        </Flex>
    )
}

export default ProductsBlock

