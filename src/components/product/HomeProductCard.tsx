import { ImageBackground } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import Flex from '#/Flex';
import Text from '#/Text';
import ProgressBar from '#/display/ProgressBar';

import { Certification, Location, State3, Trocoin } from '#/icons';


export type Product = {
    id: string;
    title: string;
    brand: string;
    seller: string;
    distance: string;
    state: string;
    trocoins: number;
    images: string[];
};

export type ProductCardProps = {
    product: Product;
    imageIndex: number;
    activeTheme: any;
    progress?: ReturnType<typeof useSharedValue<number>>;
    onPrevious?: () => void;
    onNext?: () => void;
    style?: object;
};

function HomeProductCard({
    product,
    imageIndex,
    activeTheme,
    progress,
    onPrevious,
    onNext,
    style,
}: ProductCardProps) {
    const isPreview = !onPrevious || !onNext;

    return (
        <ImageBackground
            source={{ uri: product.images[imageIndex] }}
            style={[styles.card, { borderRadius: activeTheme.radius.modal, overflow: 'hidden' }, style]}
            contentFit="cover"
            transition={150}
        >
            {!isPreview && (
                <>
                    <Pressable
                        onPress={onPrevious}
                        style={[styles.imageNavigation, styles.leftNavigation]}
                    />
                    <Pressable
                        onPress={onNext}
                        style={[styles.imageNavigation, styles.rightNavigation]}
                    />
                </>
            )}

            <Flex
                fullWidth
                pointerEvents="box-none"
                gap={activeTheme.spacing._100}
                style={{ padding: activeTheme.spacing._200 }}
            >

                {!isPreview && product.images.length > 1 && (
                    <Flex fullWidth direction="row" gap={activeTheme.spacing._100}>
                        {product.images.map((_, index) => (
                            <Flex key={index} style={{ flex: 1 }}>
                                <ProgressBar
                                    type="mono"
                                    progress={index < imageIndex ? 1 : 0}
                                    animatedProgress={index === imageIndex ? progress : undefined}
                                />
                            </Flex>
                        ))}
                    </Flex>
                )}

                <Flex gap={activeTheme.spacing._50}>
                    <InfoPill icon={<Location size={16} color="white" />} value={product.distance} activeTheme={activeTheme} />
                    <InfoPill icon={<State3 size={16} color="white" />} value={product.state} activeTheme={activeTheme} />
                    <InfoPill icon={<Trocoin size={16} color="white" />} value={String(product.trocoins)} activeTheme={activeTheme} />
                </Flex>
            </Flex>

            <Flex
                pointerEvents="box-none"
                style={{ width: '100%', padding: activeTheme.spacing._200 }}
            >
                <Text variant="title_Large" style={styles.textColor}>
                    {product.title}
                </Text>
                <Text variant="title_Small" style={styles.textColor}>
                    {product.brand}
                </Text>
                <Flex direction="row" gap={2} alignItems="center">
                    <Text variant="title_Small" style={styles.textColor}>
                        {product.seller}
                    </Text>
                    <Certification filled size={16} color={activeTheme.colors.icon.brand} />
                </Flex>
            </Flex>
        </ImageBackground>
    );
}

export default HomeProductCard;

function InfoPill({
    icon,
    value,
    activeTheme,
}: {
    icon: React.ReactNode;
    value: string;
    activeTheme: any;
}) {
    return (
        <Flex
            direction="row"
            alignItems="center"
            gap={activeTheme.spacing._50}
            style={{
                padding: activeTheme.spacing._100,
                borderRadius: activeTheme.radius.modal,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.25)',
            }}
        >
            {icon}
            <Text variant="label_Medium" style={styles.textColor}>
                {value}
            </Text>
        </Flex>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'space-between',

        boxShadow: '0px 2px 5px 1px rgba(0,0,0,0.25)'
    },
    nextCard: {
        transform: [{ scale: 0.96 }],
    },
    imageNavigation: {
        position: 'absolute',
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: 1,
    },
    leftNavigation: {
        left: 0,
    },
    rightNavigation: {
        right: 0,
    },
    textColor: {
        color: 'white',
    },
});
