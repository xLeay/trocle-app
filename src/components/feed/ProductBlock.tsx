import { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { Product } from "@/src/types";

import Flex from "#/Flex";
import Text from "#/Text";
import Button from '#/controls/Button';
import ImagePagination from '#/controls/ImagePagination';

import { Heart, State3, Certification } from '@/src/components/icons';


interface ProductsBlockProps {
    item: Product
    liked: boolean;
    onToggleLike: () => void;
}

const ProductsBlock: React.FC<ProductsBlockProps> = ({
    item,
    liked,
    onToggleLike
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    });

    const { activeTheme } = useTheme();

    return (
        <Flex
            // border
            // borderColor="blue"
            gap={activeTheme.spacing._100}
            style={{
                width: '100%',
                flex: 1,
                paddingHorizontal: activeTheme.spacing._200,
            }}>
            {/* Carrousel d’images horizontal */}
            <View style={{ borderRadius: 16, overflow: 'hidden', width: '100%', height: 324 }}>
                <FlashList
                    data={item.images}
                    horizontal
                    pagingEnabled
                    snapToInterval={343}

                    keyExtractor={(uri, index) => `${item.id}-img-${index}`}
                    onViewableItemsChanged={viewableItemsChanged.current}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: imageUri }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
                        </View>
                    )}
                />

                {/* Dots pagination */}
                <Flex style={{
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

                    <Flex style={{ flex: 1, marginRight: 8 }}>
                        <Text
                            variant="title_Small"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >{item.title}</Text>
                    </Flex>
                    <Flex direction="row" gap={4} alignItems='center'>
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
        </Flex>
    );
}

export default ProductsBlock

const styles = StyleSheet.create({
    item: {
        width: 343,
        height: 324,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
