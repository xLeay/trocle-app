import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { usePhotoContext } from '#/context/PhotoContext';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Button from '#/controls/Button';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '@/src/components/display/TopAppBar/TopAppBar';

import { Arrowleft, Crop, Delete, Rotate } from '#/icons';


export default function ProductImageModal() {
    const { theme, activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = true;
    const onBack = useGoBack();

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: '',
        rightArea: [
            {
                label: 'Appliquer',
                onPress: () => router.back(),
            },
        ],
    });

    const router = useRouter();
    const { uri, index } = useLocalSearchParams<{ uri: string; index: string }>();

    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error("PhotoContext absent du provider");

    const [ready, setReady] = useState(false);
    const idx = Number(index);

    const [currentUri, setCurrentUri] = useState<string | undefined>(undefined);

    const { photos, setPhotos } = photoContext;
    const ctx = useImageManipulator(photos[idx].uri);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!photoContext) return;

        const { photos } = photoContext;
        if (photos[idx]) {
            setReady(true);
        } else {
            console.warn("Photo non trouvée à l'index :", idx);
            router.back();
        }
    }, [photoContext, idx]);

    useEffect(() => {
        if (photos[idx]) {
            setCurrentUri(photos[idx].uri);
        }
    }, [photos, idx]);


    const handleCrop = () => {
        router.push({
            pathname: '/modal/cropImage',
            params: {
                index: String(idx),
            },
        });
    };

    const handleRotate = async () => {
        console.log('handleRotate');

        if (!uri) return;
        setLoading(true);

        ctx.rotate(90);
        const image = await ctx.renderAsync();
        const result = await image.saveAsync({
            format: SaveFormat.JPEG,
        });

        const newPhotos = [...photos];
        newPhotos[idx] = { ...photos[idx], uri: result.uri };
        setPhotos(newPhotos);
        setCurrentUri(result.uri);

        setLoading(false);
    }

    const handleDelete = () => {
        console.log('handleDelete');

        if (!uri) return;
        const newPhotos = [...photos];
        newPhotos.splice(idx, 1);

        router.back();

        setTimeout(() => {
            setPhotos(newPhotos);
            setCurrentUri(newPhotos[0]?.uri);
        }, 0);
    }

    if (!ready) return null;
    return (
        <Flex style={[
            styles.container,
            { backgroundColor: activeTheme.colors.surface.secondary }
        ]}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />
            <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
                <ImageRatio
                    source={{ uri: currentUri }}
                    style={{
                        width: '100%',
                    }}
                    contentFit="contain"
                    transition={500}
                />
            </Flex>

            <Flex
                direction="row"
                justifyContent="center"
                alignItems='center'
                style={{ width: '100%', paddingHorizontal: activeTheme.spacing._200, paddingVertical: activeTheme.spacing._200 }}
            >
                <Flex direction="row" gap={activeTheme.spacing._400} style={{}}>
                    <Button
                        icon={<Crop />}
                        variant="outlined"
                        size="large"
                        onPress={() => {
                            handleCrop();
                        }}
                        disabled
                    />

                    <Button
                        icon={<Rotate />}
                        variant="outlined"
                        size="large"
                        onPress={() => {
                            handleRotate();
                        }}
                        loading={loading}
                    />

                    <Button
                        icon={<Delete />}
                        variant="outlined"
                        size="large"
                        onPress={() => {
                            handleDelete();
                        }}
                    />
                </Flex>
            </Flex>


        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});