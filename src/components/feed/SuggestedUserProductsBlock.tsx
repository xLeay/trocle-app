import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from 'expo-image';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { Product, User } from "@/src/types";

import Flex from "#/Flex";
import Grid from "#/Grid";
import Text from "#/Text";
import Button from '#/controls/Button';
import Card from "#/Card";
import Avatar from "#/display/Avatar";

import { Heart, State1, State2, State3, State4, Star0, Star05, Star1, Certification, Plusvert } from '#/icons';


interface SuggestedUserProductsBlockProps {
    user: User;
    products: Product[];
    liked: { [id: string]: boolean };
    onToggleLike: (id: string) => void;
}

const SuggestedUserProductsBlock: React.FC<SuggestedUserProductsBlockProps> = ({
    user,
    products,
    liked,
    onToggleLike
}) => {
    const { activeTheme } = useTheme();

    // user.profilePicture

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

            <Card>
                {/* Label section */}
                <Flex direction="row" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    {/* Gauche */}
                    <Flex direction="row" gap={activeTheme.spacing._100}>
                        <Avatar size="medium" customImage={require('@/assets/icon.png')} />
                        <Flex>
                            <Text variant="label_Large">lesimpoy</Text>
                            <Flex direction="row" gap={activeTheme.spacing._50}>
                                <Flex direction="row">
                                    <Text variant="body_Small">4,8</Text>
                                    <Star1 size={16} />
                                </Flex>
                                <Text variant="body_Small">(48)</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Droite */}
                    <Flex direction="row" gap={activeTheme.spacing._50}>
                        <Button label="Suivre" variant="tertiary" />
                        <Button icon={<Plusvert />} variant="ghost" />
                    </Flex>
                </Flex>

                {/* Articles */}
                <Grid
                    columns={2}
                    columnGap={activeTheme.spacing._100}
                    rowGap={activeTheme.spacing._200}
                    style={{ width: '100%' }}
                >
                    {products.map(product => (
                        <Flex
                            key={product.id}
                            gap={activeTheme.spacing._100}
                        >
                            {/* Photo article */}
                            <Flex style={[styles.item, { borderRadius: activeTheme.radius.modal }]}>
                                <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />

                                {/* Bouton like */}
                                <Flex style={{
                                    position: 'absolute',
                                    right: activeTheme.spacing._100,
                                    bottom: activeTheme.spacing._100,
                                }}>
                                    <Button
                                        icon={<Heart filled={!!liked[product.id]} />}
                                        variant={!!liked[product.id] ? "gradient" : 'transparent'}
                                        size="large"
                                        onPress={() => onToggleLike(product.id)}
                                    />
                                </Flex>
                            </Flex>

                            {/* Informations article */}
                            <Flex>
                                <Text
                                    variant="body_Medium"
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {product.title}
                                </Text>
                                <Text variant="body_Small" type="secondary">Glénat</Text>
                                <Flex direction="row" gap={activeTheme.spacing._50} alignItems='center'>
                                    <Text variant="body_Small" type="secondary">Comme neuf</Text>
                                    <State1 color={activeTheme.colors.text.secondary} />
                                </Flex>
                            </Flex>

                        </Flex>
                    ))}
                </Grid>
            </Card>

        </Flex>
    );
}

export default SuggestedUserProductsBlock

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
