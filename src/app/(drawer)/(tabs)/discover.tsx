import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/hooks/useTheme';
import useTopAppBar from '@/src/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Button from '#/controls/Button';
import ImagePagination from '#/controls/ImagePagination';
import { Heart } from '@/src/components/icons';


import { usePosts } from '@/src/hooks/usePosts';

export default function Tab() {
    const { activeTheme } = useTheme();
    const [search, setSearch] = useState('');

    const { left, center, right } = useTopAppBar("_search", {
        search: search,
        setSearch: setSearch,
        placeHolder: "Recherchez sur Trocle",
    });

    const { posts, loading, error } = usePosts();

    // const imagesList = [
    //     'https://images1.vinted.net/t/04_01de2_ZGKABtika9i8WkksPtb27e4D/f800/1746196575.jpeg?s=7ebf8d9920dd6da3506cde89e009592c739ff1cc',
    //     'https://images1.vinted.net/t/02_019c1_7u1tf2oBHWaHvvczUT9PwG8E/f800/1746196575.jpeg?s=040d7d6c0f6d27a58a819c89e0f41a631e9cfeff',
    //     'https://images1.vinted.net/t/04_01750_C7H5xAmTdUwgX6vxxKpQxMXD/f800/1746196575.jpeg?s=c34ab299ea7d439c4f160f3b1564e2809408e477',
    //     'https://images1.vinted.net/t/04_016fe_mZR3hE7dGUnQfb4Kp4Msqxav/f800/1746196575.jpeg?s=ee70f746bf5b5564c41c9ebe1979c1307a75e498',
    // ]

    // const data = imagesList.map((image, index) => ({
    //     id: index.toString(),
    //     title: `Image ${index + 1}`,
    //     uri: image,
    // }));

    const data = posts.map((post, index) => ({
        id: post.id,
        title: post.title,
        uri: post.images[0],
    }));


    const [currentIndex, setCurrentIndex] = useState(0);
    const onViewRef = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });


    const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>({});

    const toggleLike = (id: string) => {
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    if (loading) return <Text>Chargement...</Text>;
    if (error) return <Text>Erreur : {error}</Text>;
    if (posts.length === 0) return <Text>Aucun post</Text>;

    return (
        <Flex scroll gap={15} direction='column' style={[styles.container, { backgroundColor: activeTheme.colors.surface.primary }]}>
            <Stack.Screen
                options={{
                    title: 'Discover',
                    header: () => <TopAppBar
                        left={left}
                        center={center}
                        right={right}
                    />,
                }}
            />

            <Text>Tab Discover</Text>

            {/* Photo article */}
            <View style={{
                width: '100%',
                borderRadius: 16,
                overflow: 'hidden',
            }}>
                <FlashList
                    data={data}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: item.uri }} style={styles.image} contentFit="cover" />
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    horizontal
                    estimatedItemSize={500}
                    snapToInterval={343}
                    snapToAlignment="start"
                    pagingEnabled
                    onViewableItemsChanged={onViewRef.current}
                />

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
                    <Text variant='label_Small' type='invert'>12h</Text>
                </Flex>

                {/* Like de l'article */}
                <Flex style={{
                    position: 'absolute',
                    right: activeTheme.spacing._200,
                    top: activeTheme.spacing._200,
                }}>
                    <Button icon={<Heart />} variant="transparent" size="large" />
                </Flex>
                <Flex style={{
                    position: 'absolute',
                    right: 200,
                    top: activeTheme.spacing._200,
                }}>
                    <Button
                        icon={<Heart filled={!!likedPosts[data[currentIndex].id]} />}
                        variant="gradient"
                        size="large"
                        onPress={() => toggleLike(data[currentIndex].id)}
                    />
                </Flex>

                {/* Dots */}
                <Flex style={{
                    position: 'absolute',
                    bottom: activeTheme.spacing._200,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',

                    // borderColor: 'red',
                    // borderWidth: 1,
                }}>
                    <ImagePagination
                        total={data.length}
                        currentIndex={currentIndex}
                        type="dot"
                    />
                </Flex>
            </View>

        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        width: 343,
        height: 324,

        // borderWidth: 1,
        // borderColor: 'green',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
